from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.app.core.database import get_db
from backend.app.models.models import ChatSession, ChatMessage, ContentChunk, Lesson, Curriculum
from backend.app.models.schemas import ChatSessionOut, ChatSessionCreate, ChatMessageOut, ChatMessageCreate
from backend.app.services.ai_service import AIService

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])

@router.get("/sessions", response_model=List[ChatSessionOut])
async def list_chat_sessions(
    curriculum_id: int,
    lesson_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ChatSession).where(ChatSession.curriculum_id == curriculum_id)
    if lesson_id:
        stmt = stmt.where(ChatSession.lesson_id == lesson_id)
    stmt = stmt.options(selectinload(ChatSession.messages)).order_by(ChatSession.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/sessions", response_model=ChatSessionOut)
async def create_chat_session(data: ChatSessionCreate, db: AsyncSession = Depends(get_db)):
    session = ChatSession(
        curriculum_id=data.curriculum_id,
        lesson_id=data.lesson_id,
        title=data.title or "محادثة تعليمية جديدة"
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    # Reload with empty messages
    stmt = select(ChatSession).where(ChatSession.id == session.id).options(selectinload(ChatSession.messages))
    res = await db.execute(stmt)
    return res.scalar_one()

@router.get("/sessions/{session_id}", response_model=ChatSessionOut)
async def get_chat_session(session_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(ChatSession).where(ChatSession.id == session_id).options(selectinload(ChatSession.messages))
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="جلسة المحادثة غير موجودة")
    return session

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageOut)
async def send_chat_message(
    session_id: int,
    data: ChatMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ChatSession).where(ChatSession.id == session_id).options(selectinload(ChatSession.messages))
    res = await db.execute(stmt)
    session = res.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="جلسة المحادثة غير موجودة")

    # 1. Save user message
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=data.content
    )
    db.add(user_msg)
    await db.flush()

    # 2. Retrieve relevant content chunks (Grounded Retrieval / RAG)
    chunks_stmt = select(ContentChunk).where(ContentChunk.curriculum_id == session.curriculum_id)
    if session.lesson_id:
        chunks_stmt = chunks_stmt.where(ContentChunk.lesson_id == session.lesson_id)
    
    chunks_res = await db.execute(chunks_stmt.limit(10))
    chunks = chunks_res.scalars().all()
    
    chunk_dicts = [
        {
            "page_number": c.page_number,
            "heading": c.heading,
            "content_text": c.content_text,
            "chunk_id": c.id
        }
        for c in chunks
    ]

    # 3. Build history
    history = [
        {"role": m.role, "content": m.content}
        for m in session.messages
    ]

    # 4. Generate AI response
    ai_result = await AIService.generate_response(
        prompt=data.content,
        context_chunks=chunk_dicts,
        history=history,
        explanation_level=data.explanation_level,
        allow_external_enrichment=data.allow_external_enrichment
    )

    # 5. Save assistant message
    bot_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=ai_result["content"],
        sources=ai_result.get("sources", []),
        has_external_content=ai_result.get("has_external_content", False)
    )
    db.add(bot_msg)
    await db.commit()
    await db.refresh(bot_msg)

    return bot_msg

@router.post("/explain-lesson/{lesson_id}")
async def explain_lesson(
    lesson_id: int,
    explanation_level: str = "standard",
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Lesson).where(Lesson.id == lesson_id).options(selectinload(Lesson.chunks))
    res = await db.execute(stmt)
    lesson = res.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="الدرس غير موجود")

    all_text = "\n".join([c.content_text for c in lesson.chunks])
    if not all_text:
        return {"content": "لا يتوفر نص كافٍ في هذا الدرس لتقديم الشرح.", "sources": []}

    chunk_dicts = [
        {"page_number": c.page_number, "heading": c.heading, "content_text": c.content_text}
        for c in lesson.chunks
    ]

    prompt = f"قدم شرحاً وافياً لدرس: '{lesson.title}' وفق المستوى المطلوب."
    result = await AIService.generate_response(
        prompt=prompt,
        context_chunks=chunk_dicts,
        explanation_level=explanation_level
    )
    return result
