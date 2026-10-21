import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.models.models import Curriculum, Chapter, Lesson, ContentChunk, SourceFile
from backend.app.models.schemas import CurriculumOut, CurriculumCreate, CurriculumUpdate, ChapterOut, ContentChunkOut
from backend.app.services.ingestion import IngestionService
from backend.app.services.ai_service import AIService

router = APIRouter(prefix="/curriculums", tags=["Curriculums"])

@router.get("", response_model=List[CurriculumOut])
async def list_curriculums(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Curriculum).order_by(Curriculum.created_at.desc()))
    return result.scalars().all()

@router.post("", response_model=CurriculumOut)
async def create_curriculum(data: CurriculumCreate, db: AsyncSession = Depends(get_db)):
    curr = Curriculum(**data.model_dump())
    db.add(curr)
    await db.commit()
    await db.refresh(curr)
    return curr

@router.get("/{curriculum_id}", response_model=CurriculumOut)
async def get_curriculum(curriculum_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Curriculum).where(Curriculum.id == curriculum_id))
    curr = result.scalar_one_or_none()
    if not curr:
        raise HTTPException(status_code=404, detail="المنهج غير موجود")
    return curr

@router.put("/{curriculum_id}", response_model=CurriculumOut)
async def update_curriculum(curriculum_id: int, data: CurriculumUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Curriculum).where(Curriculum.id == curriculum_id))
    curr = result.scalar_one_or_none()
    if not curr:
        raise HTTPException(status_code=404, detail="المنهج غير موجود")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(curr, field, value)
        
    await db.commit()
    await db.refresh(curr)
    return curr

@router.get("/{curriculum_id}/chapters", response_model=List[ChapterOut])
async def get_curriculum_chapters(curriculum_id: int, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Chapter)
        .where(Chapter.curriculum_id == curriculum_id)
        .options(selectinload(Chapter.lessons))
        .order_by(Chapter.order_index)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{curriculum_id}/chunks", response_model=List[ContentChunkOut])
async def get_curriculum_chunks(curriculum_id: int, lesson_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    stmt = select(ContentChunk).where(ContentChunk.curriculum_id == curriculum_id)
    if lesson_id:
        stmt = stmt.where(ContentChunk.lesson_id == lesson_id)
    stmt = stmt.order_by(ContentChunk.page_number, ContentChunk.paragraph_index)
    result = await db.execute(stmt)
    return result.scalars().all()

async def process_uploaded_document(curriculum_id: int, source_file_id: int, file_path: str, file_type: str, db: AsyncSession):
    try:
        # Extract content
        if file_type == "pdf":
            chunks_data = IngestionService.extract_from_pdf(file_path, curriculum_id)
        elif file_type == "docx":
            chunks_data = IngestionService.extract_from_docx(file_path, curriculum_id)
        else:
            chunks_data = []

        if not chunks_data:
            return

        # Propose chapters and lessons
        structure = IngestionService.propose_structure(chunks_data)
        
        # Save chapters and lessons
        for c_idx, chap_info in enumerate(structure):
            chap = Chapter(
                curriculum_id=curriculum_id,
                title=chap_info["title"],
                order_index=c_idx + 1
            )
            db.add(chap)
            await db.flush()

            for l_idx, lesson_info in enumerate(chap_info.get("lessons", [])):
                lesson = Lesson(
                    chapter_id=chap.id,
                    curriculum_id=curriculum_id,
                    title=lesson_info["title"],
                    order_index=l_idx + 1
                )
                db.add(lesson)
                await db.flush()

                # Add chunks for this lesson
                for chunk_idx in lesson_info.get("chunks_indices", []):
                    c = chunks_data[chunk_idx]
                    chunk_obj = ContentChunk(
                        curriculum_id=curriculum_id,
                        chapter_id=chap.id,
                        lesson_id=lesson.id,
                        source_file_id=source_file_id,
                        page_number=c.get("page_number"),
                        paragraph_index=c.get("paragraph_index"),
                        heading=c.get("heading"),
                        content_text=c.get("content_text"),
                        image_paths=c.get("image_paths", []),
                        has_math=c.get("has_math", False),
                        has_tables=c.get("has_tables", False)
                    )
                    db.add(chunk_obj)

        # Update curriculum status to 'review'
        curr_res = await db.execute(select(Curriculum).where(Curriculum.id == curriculum_id))
        curr = curr_res.scalar_one_or_none()
        if curr:
            curr.status = "review"

        file_res = await db.execute(select(SourceFile).where(SourceFile.id == source_file_id))
        sfile = file_res.scalar_one_or_none()
        if sfile:
            sfile.status = "processed"

        await db.commit()
    except Exception as e:
        await db.rollback()
        file_res = await db.execute(select(SourceFile).where(SourceFile.id == source_file_id))
        sfile = file_res.scalar_one_or_none()
        if sfile:
            sfile.status = "error"
            sfile.error_message = str(e)
            await db.commit()

@router.post("/{curriculum_id}/upload")
async def upload_document(
    curriculum_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Curriculum).where(Curriculum.id == curriculum_id))
    curr = result.scalar_one_or_none()
    if not curr:
        raise HTTPException(status_code=404, detail="المنهج غير موجود")

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["pdf", "docx", "png", "jpg", "jpeg"]:
        raise HTTPException(status_code=400, detail="نوع الملف غير مدعوم. الصيغ المدعومة هي: PDF, DOCX, الصور")

    # Save file to uploads directory
    target_dir = settings.UPLOAD_DIR / str(curriculum_id)
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / file.filename

    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    source_file = SourceFile(
        curriculum_id=curriculum_id,
        filename=file.filename,
        file_path=str(target_path),
        file_type="pdf" if file_ext == "pdf" else ("docx" if file_ext == "docx" else "image"),
        file_size=target_path.stat().st_size,
        status="processing"
    )
    db.add(source_file)
    curr.status = "processing"
    await db.commit()
    await db.refresh(source_file)

    # Process extraction immediately or background
    await process_uploaded_document(
        curriculum_id=curriculum_id,
        source_file_id=source_file.id,
        file_path=str(target_path),
        file_type=source_file.file_type,
        db=db
    )

    return {"message": "تم رفع ومعالجة المستند بنجاح", "source_file_id": source_file.id}

@router.post("/{curriculum_id}/approve")
async def approve_curriculum(curriculum_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Curriculum).where(Curriculum.id == curriculum_id))
    curr = result.scalar_one_or_none()
    if not curr:
        raise HTTPException(status_code=404, detail="المنهج غير موجود")
    
    curr.status = "approved"
    await db.commit()
    return {"message": "تم اعتماد المنهج بنجاح وأصبح جاهزاً للدراسة والاختبار"}
