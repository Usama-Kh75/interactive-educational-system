from typing import List, Dict, Any, Optional
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from backend.app.core.database import get_db
from backend.app.models.models import Question, Exam, ExamAttempt, Lesson, ContentChunk
from backend.app.models.schemas import QuestionOut, ExamCreate, ExamOut, ExamAttemptSubmit, ExamAttemptOut
from backend.app.services.ai_service import AIService

router = APIRouter(prefix="/exams", tags=["Exams & Questions"])

@router.get("/questions", response_model=List[QuestionOut])
async def list_questions(
    curriculum_id: int,
    chapter_id: Optional[int] = None,
    lesson_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Question).where(Question.curriculum_id == curriculum_id)
    if chapter_id:
        stmt = stmt.where(Question.chapter_id == chapter_id)
    if lesson_id:
        stmt = stmt.where(Question.lesson_id == lesson_id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/generate-lesson-quiz/{lesson_id}")
async def generate_lesson_quiz(
    lesson_id: int,
    count: int = 5,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Lesson).where(Lesson.id == lesson_id).options(selectinload(Lesson.chunks))
    res = await db.execute(stmt)
    lesson = res.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="الدرس غير موجود")

    all_text = "\n".join([c.content_text for c in lesson.chunks])
    if not all_text:
        raise HTTPException(status_code=400, detail="محتوى الدرس غير كافٍ لإنشاء أسئلة")

    questions_data = await AIService.generate_quiz_questions(
        lesson_title=lesson.title,
        text_content=all_text,
        count=count
    )

    created_questions = []
    for q in questions_data:
        question_obj = Question(
            curriculum_id=lesson.curriculum_id,
            chapter_id=lesson.chapter_id,
            lesson_id=lesson.id,
            question_text=q["question_text"],
            question_type=q.get("question_type", "multiple_choice"),
            options=q.get("options", []),
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation"),
            points=1.0,
            difficulty=q.get("difficulty", "medium"),
            source_type="ai_generated"
        )
        db.add(question_obj)
        created_questions.append(question_obj)

    await db.commit()
    return {"message": f"تم توليد {len(created_questions)} أسئلة بنجاح", "count": len(created_questions)}

@router.post("", response_model=ExamOut)
async def create_exam(data: ExamCreate, db: AsyncSession = Depends(get_db)):
    exam = Exam(
        curriculum_id=data.curriculum_id,
        title=data.title,
        exam_type=data.exam_type,
        duration_minutes=data.duration_minutes,
        selected_chapters=data.selected_chapters,
        questions_config={"count": data.question_count}
    )
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam

@router.get("/{exam_id}/start")
async def start_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    exam_res = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = exam_res.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="الاختبار غير موجود")

    # Fetch available questions for this curriculum
    stmt = select(Question).where(Question.curriculum_id == exam.curriculum_id)
    if exam.selected_chapters:
        stmt = stmt.where(Question.chapter_id.in_(exam.selected_chapters))
    
    q_count = exam.questions_config.get("count", 10)
    stmt = stmt.order_by(func.random()).limit(q_count)
    q_res = await db.execute(stmt)
    questions = q_res.scalars().all()

    # Create new attempt
    attempt = ExamAttempt(
        exam_id=exam.id,
        status="in_progress",
        total_points=float(len(questions))
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    # Return questions without revealing correct answer
    client_questions = [
        {
            "id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "options": q.options,
            "points": q.points
        }
        for q in questions
    ]

    return {
        "attempt_id": attempt.id,
        "exam_title": exam.title,
        "duration_minutes": exam.duration_minutes,
        "questions": client_questions
    }

@router.post("/attempts/{attempt_id}/submit", response_model=ExamAttemptOut)
async def submit_exam_attempt(
    attempt_id: int,
    data: ExamAttemptSubmit,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ExamAttempt).where(ExamAttempt.id == attempt_id).options(selectinload(ExamAttempt.exam))
    res = await db.execute(stmt)
    attempt = res.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="المحاولة غير موجودة")

    # Evaluate answers
    evaluations = {}
    earned_score = 0.0
    total_score = 0.0

    user_answers = data.user_answers
    for q_id_str, user_ans in user_answers.items():
        try:
            q_id = int(q_id_str)
        except ValueError:
            continue
        
        q_res = await db.execute(select(Question).where(Question.id == q_id))
        q = q_res.scalar_one_or_none()
        if not q:
            continue

        total_score += q.points
        # Check correctness
        is_correct = str(user_ans).strip().lower() == str(q.correct_answer).strip().lower()
        if is_correct:
            earned_score += q.points

        evaluations[str(q.id)] = {
            "user_answer": user_ans,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "explanation": q.explanation,
            "points_earned": q.points if is_correct else 0.0
        }

    percentage = (earned_score / total_score * 100) if total_score > 0 else 0.0
    is_passed = percentage >= (attempt.exam.passing_score if attempt.exam else 60.0)

    attempt.submitted_at = datetime.datetime.utcnow()
    attempt.time_spent_seconds = data.time_spent_seconds
    attempt.score = earned_score
    attempt.total_points = total_score
    attempt.percentage = round(percentage, 1)
    attempt.is_passed = is_passed
    attempt.user_answers = user_answers
    attempt.evaluations = evaluations
    attempt.status = "completed"

    await db.commit()
    await db.refresh(attempt)
    return attempt
