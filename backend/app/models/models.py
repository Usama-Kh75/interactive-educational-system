import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, JSON
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Curriculum(Base):
    __tablename__ = "curriculums"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)  # اسم المنهج
    subject = Column(String(100), nullable=False, index=True)  # المادة
    stage = Column(String(100), nullable=True)  # المرحلة الدراسية
    grade = Column(String(100), nullable=True)  # الصف الدراسي
    year = Column(String(50), nullable=True)  # السنة / العام الدراسي
    edition = Column(String(100), nullable=True)  # الطبعة
    language = Column(String(50), default="ar")  # لغة المنهج
    description = Column(Text, nullable=True)  # الوصف
    status = Column(String(50), default="draft")  # draft, processing, review, approved, archived, failed
    cover_image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    chapters = relationship("Chapter", back_populates="curriculum", cascade="all, delete-orphan", order_by="Chapter.order_index")
    source_files = relationship("SourceFile", back_populates="curriculum", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="curriculum", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="curriculum", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="curriculum", cascade="all, delete-orphan")


class SourceFile(Base):
    __tablename__ = "source_files"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, docx, image
    file_size = Column(Integer, nullable=False)
    page_count = Column(Integer, default=0)
    status = Column(String(50), default="uploaded")  # uploaded, processing, processed, error
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    curriculum = relationship("Curriculum", back_populates="source_files")
    chunks = relationship("ContentChunk", back_populates="source_file", cascade="all, delete-orphan")


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    curriculum = relationship("Curriculum", back_populates="chapters")
    lessons = relationship("Lesson", back_populates="chapter", cascade="all, delete-orphan", order_by="Lesson.order_index")
    chunks = relationship("ContentChunk", back_populates="chapter")
    questions = relationship("Question", back_populates="chapter")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0)
    summary = Column(Text, nullable=True)  # ملخص ذكي للدرس
    key_concepts = Column(JSON, nullable=True)  # قائمة المفاهيم الرئيسية
    status = Column(String(50), default="draft")  # draft, approved, mastered
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    chapter = relationship("Chapter", back_populates="lessons")
    chunks = relationship("ContentChunk", back_populates="lesson", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="lesson")
    questions = relationship("Question", back_populates="lesson")


class ContentChunk(Base):
    __tablename__ = "content_chunks"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    source_file_id = Column(Integer, ForeignKey("source_files.id", ondelete="CASCADE"), nullable=True)
    
    # تفاصيل الإحالة الدقيقة للمصدر الأصلي
    page_number = Column(Integer, nullable=True)  # رقم صفحة الملف
    printed_page_number = Column(String(50), nullable=True)  # رقم الصفحة المطبوع في الكتاب
    paragraph_index = Column(Integer, nullable=True)
    heading = Column(String(255), nullable=True)
    
    # المحتوى المستخرج
    content_text = Column(Text, nullable=False)
    original_snippet = Column(Text, nullable=True)  # لمقارنة الأصل بالنص المصحح
    image_paths = Column(JSON, default=list)  # مسارات الصور المضمنة في هذا المقطع
    has_math = Column(Boolean, default=False)  # هل يحتوي على معادلات
    has_tables = Column(Boolean, default=False)
    
    # حالة المراجعة
    is_reviewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    source_file = relationship("SourceFile", back_populates="chunks")
    chapter = relationship("Chapter", back_populates="chunks")
    lesson = relationship("Lesson", back_populates="chunks")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), default="محادثة جديدة")
    allow_external_enrichment = Column(Boolean, default=False)  # خيار المنهج فقط أو مع إثراء خارجي
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    curriculum = relationship("Curriculum", back_populates="chat_sessions")
    lesson = relationship("Lesson", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    
    # مراجع الإسناد (Sources Grounding)
    sources = Column(JSON, default=list)  # [{page, chunk_id, snippet, title}]
    has_external_content = Column(Boolean, default=False)  # هل تم استخدام إثراء خارجي
    external_sources = Column(JSON, default=list)
    
    # تقييم الإجابة والملاحظات
    feedback = Column(String(50), nullable=True)  # accurate, inaccurate, flagged
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="multiple_choice")  # multiple_choice, true_false, short_answer, essay
    options = Column(JSON, default=list)  # الخيارات للمتعدد
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)  # تفسير الإجابة والمرجع
    points = Column(Float, default=1.0)
    difficulty = Column(String(50), default="medium")  # easy, medium, hard
    
    # بيانات استيراد ونمط السؤال
    source_type = Column(String(50), default="book_exercise")  # official_exam, book_exercise, ai_generated, remedial
    exam_year = Column(String(50), nullable=True)  # سنة الامتحان السابق إن وجد
    exam_session = Column(String(50), nullable=True)  # دور أول / دور ثاني
    exam_authority = Column(String(100), nullable=True)  # الوزارة / الجهة
    
    is_reviewed = Column(Boolean, default=False)
    status = Column(String(50), default="approved")  # draft, approved, archived
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    curriculum = relationship("Curriculum", back_populates="questions")
    chapter = relationship("Chapter", back_populates="questions")
    lesson = relationship("Lesson", back_populates="questions")


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    exam_type = Column(String(50), default="quiz")  # quiz, chapter_test, official_mock, remedial
    duration_minutes = Column(Integer, default=30)
    passing_score = Column(Float, default=60.0)
    selected_chapters = Column(JSON, default=list)  # معرفات الفصول المختارة
    questions_config = Column(JSON, default=dict)  # تفاصيل التوليد
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    curriculum = relationship("Curriculum", back_populates="exams")
    attempts = relationship("ExamAttempt", back_populates="exam", cascade="all, delete-orphan")


class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    time_spent_seconds = Column(Integer, default=0)
    
    score = Column(Float, default=0.0)
    total_points = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    is_passed = Column(Boolean, default=False)
    
    # حفظ الإجابات والتقييم
    user_answers = Column(JSON, default=dict)  # {question_id: answer}
    evaluations = Column(JSON, default=dict)  # {question_id: {is_correct, score, feedback}}
    status = Column(String(50), default="in_progress")  # in_progress, completed, abandoned
    is_synced = Column(Boolean, default=True)  # للمزامنة عند العمل دون اتصال
    
    exam = relationship("Exam", back_populates="attempts")


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="not_started")  # not_started, opened, completed, mastered
    attempts_count = Column(Integer, default=0)
    last_score = Column(Float, default=0.0)
    weak_concepts = Column(JSON, default=list)  # المفاهيم التي أخفق فيها لتوجيه التدريب العلاجي
    last_studied_at = Column(DateTime, default=datetime.datetime.utcnow)
