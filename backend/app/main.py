from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api import curriculums, tutor, exams

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for localhost and local network devices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for icons and storage
app.mount("/icons", StaticFiles(directory=str(settings.BASE_DIR / "icons")), name="icons")
app.mount("/storage", StaticFiles(directory=str(settings.STORAGE_DIR)), name="storage")

# Include API routers
app.include_router(curriculums.router, prefix=settings.API_V1_PREFIX)
app.include_router(tutor.router, prefix=settings.API_V1_PREFIX)
app.include_router(exams.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def serve_index():
    return FileResponse(settings.BASE_DIR / "index.html")

@app.get("/manifest.json")
async def serve_manifest():
    return FileResponse(settings.BASE_DIR / "manifest.json", media_type="application/manifest+json")

@app.get("/sw.js")
async def serve_sw():
    return FileResponse(settings.BASE_DIR / "sw.js", media_type="application/javascript")

@app.get("/curriculum_data.js")
async def serve_curriculum_data():
    return FileResponse(settings.BASE_DIR / "curriculum_data.js")

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "author": settings.AUTHOR,
        "has_ai_key": bool(settings.GEMINI_API_KEY)
    }
