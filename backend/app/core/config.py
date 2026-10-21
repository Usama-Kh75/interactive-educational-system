import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
EXTRACTED_DIR = STORAGE_DIR / "extracted"
BACKUP_DIR = STORAGE_DIR / "backups"
DB_PATH = STORAGE_DIR / "database.sqlite3"

for d in [STORAGE_DIR, UPLOAD_DIR, EXTRACTED_DIR, BACKUP_DIR]:
    d.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    PROJECT_NAME: str = "النظام التعليمي التفاعلي"
    VERSION: str = "2.1.0"
    AUTHOR: str = "المهندس أسامة خليل هاشم"
    API_V1_PREFIX: str = "/api"
    
    BASE_DIR: Path = BASE_DIR
    STORAGE_DIR: Path = STORAGE_DIR
    UPLOAD_DIR: Path = UPLOAD_DIR
    EXTRACTED_DIR: Path = EXTRACTED_DIR
    BACKUP_DIR: Path = BACKUP_DIR
    DATABASE_URL: str = f"sqlite+aiosqlite:///{DB_PATH.as_posix()}"
    SYNC_DATABASE_URL: str = f"sqlite:///{DB_PATH.as_posix()}"
    
    # Gemini AI configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

settings = Settings()
