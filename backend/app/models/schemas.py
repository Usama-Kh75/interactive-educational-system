from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
import datetime

# --- Curriculum Schemas ---
class CurriculumBase(BaseModel):
    name: str
    subject: str
    stage: Optional[str] = None
    grade: Optional[str] = None
    year: Optional[str] = None
    edition: Optional[str] = None
    language: str = "ar"
    description: Optional[str] = None

class CurriculumCreate(CurriculumBase):
    pass

class CurriculumUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    stage: Optional[str] = None
    grade: Optional[str] = None
    year: Optional[str] = None
    edition: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class CurriculumOut(CurriculumBase):
    id: int
    status: Optional[str] = "approved"
    created_at: datetime.datetime
    updated_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

# --- Chapter & Lesson Schemas ---
class LessonOut(BaseModel):
    id: int
    chapter_id: int
    curriculum_id: int
    title: str
    order_index: int
    summary: Optional[str] = None
    key_concepts: Optional[List[str]] = None
    status: Optional[str] = "approved"
    model_config = ConfigDict(from_attributes=True)

class ChapterOut(BaseModel):
    id: int
    curriculum_id: int
    title: str
    order_index: int
    description: Optional[str] = None
    lessons: List[LessonOut] = []
    model_config = ConfigDict(from_attributes=True)

# --- Content Chunk & Source Schemas ---
class ContentChunkOut(BaseModel):
    id: int
    curriculum_id: int
    chapter_id: Optional[int] = None
    lesson_id: Optional[int] = None
    page_number: Optional[int] = None
    printed_page_number: Optional[str] = None
    paragraph_index: Optional[int] = None
    heading: Optional[str] = None
    content_text: str
    image_paths: List[str] = []
    has_math: bool
    is_reviewed: bool
    model_config = ConfigDict(from_attributes=True)

# --- Chat & Assistant Schemas ---
class ChatMessageCreate(BaseModel):
    content: str
    allow_external_enrichment: bool = False
    explanation_level: str = "standard"  # simple, deep, step_by_step, standard

class ChatMessageOut(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    sources: List[Dict[str, Any]] = []
    has_external_content: bool = False
    external_sources: List[Dict[str, Any]] = []
    feedback: Optional[str] = None
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class ChatSessionCreate(BaseModel):
    curriculum_id: int
    lesson_id: Optional[int] = None
    title: Optional[str] = "محادثة جديدة"

class ChatSessionOut(BaseModel):
    id: int
    curriculum_id: int
    lesson_id: Optional[int] = None
    title: str
    allow_external_enrichment: bool
    created_at: datetime.datetime
    messages: List[ChatMessageOut] = []
    model_config = ConfigDict(from_attributes=True)

# --- Question & Exam Schemas ---
class QuestionOut(BaseModel):
    id: int
    curriculum_id: int
    chapter_id: Optional[int] = None
    lesson_id: Optional[int] = None
    question_text: str
    question_type: str
    options: List[str] = []
    correct_answer: str
    explanation: Optional[str] = None
    points: float
    difficulty: str
    source_type: str
    exam_year: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class ExamCreate(BaseModel):
    curriculum_id: int
    title: str
    exam_type: str = "quiz"  # quiz, chapter_test, official_mock, remedial
    duration_minutes: int = 30
    selected_chapters: List[int] = []
    question_count: int = 10

class ExamOut(BaseModel):
    id: int
    curriculum_id: int
    title: str
    exam_type: str
    duration_minutes: int
    passing_score: float
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class ExamAttemptSubmit(BaseModel):
    user_answers: Dict[str, Any]
    time_spent_seconds: int

class ExamAttemptOut(BaseModel):
    id: int
    exam_id: int
    score: float
    total_points: float
    percentage: float
    is_passed: bool
    status: Optional[str] = "approved"
    started_at: datetime.datetime
    submitted_at: Optional[datetime.datetime] = None
    time_spent_seconds: int
    evaluations: Dict[str, Any] = {}
    model_config = ConfigDict(from_attributes=True)
