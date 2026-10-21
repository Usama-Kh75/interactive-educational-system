import os
import re
import uuid
import asyncio
from pathlib import Path
from typing import List, Dict, Any
import fitz  # PyMuPDF
from docx import Document
from PIL import Image

try:
    import winocr
except ImportError:
    winocr = None

from backend.app.core.config import settings

class IngestionService:
    @classmethod
    async def extract_from_pdf_async(cls, pdf_path: str, curriculum_id: int) -> List[Dict[str, Any]]:
        """
        Extract text, images, and structure from a PDF file.
        Automatically uses fast OCR (winocr) if pages are scanned images.
        """
        doc = fitz.open(pdf_path)
        chunks = []
        image_dir = settings.EXTRACTED_DIR / str(curriculum_id) / "images"
        image_dir.mkdir(parents=True, exist_ok=True)

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            
            # Extract images from page
            saved_images = []
            image_list = page.get_images(full=True)
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    if base_image["width"] > 150 and base_image["height"] > 150:
                        img_filename = f"p{page_num + 1}_img{img_index + 1}_{uuid.uuid4().hex[:6]}.{image_ext}"
                        img_full_path = image_dir / img_filename
                        with open(img_full_path, "wb") as f:
                            f.write(image_bytes)
                        saved_images.append(f"/storage/extracted/{curriculum_id}/images/{img_filename}")
                except Exception:
                    pass

            # If no embedded digital text, perform OCR
            if not text:
                if winocr:
                    try:
                        pix = page.get_pixmap(dpi=130)
                        pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                        ocr_res = await winocr.recognize_pil(pil_img, "en")
                        text = ocr_res.text.strip()
                    except Exception as e:
                        text = f"[خطأ في قراءة الصفحة {page_num + 1}: {e}]"
                else:
                    text = f"[صفحة مصورة رقم {page_num + 1}]"

            if text:
                has_math = bool(re.search(r'[=∑∫√πθλ±×÷≠≤≥∞\^_{}]', text))
                
                # Check for Unit / Chapter / Lesson headings in text
                heading = None
                lines = [line.strip() for line in text.split("\n") if line.strip()]
                for l in lines[:5]:
                    if re.search(r'(Unit\s+\d+|Lesson\s+\d+|Chapter\s+\d+|الوحدة|الفصل|الدرس)', l, re.IGNORECASE):
                        heading = l
                        break

                paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
                if not paragraphs:
                    paragraphs = [text]

                for p_idx, para in enumerate(paragraphs):
                    chunks.append({
                        "page_number": page_num + 1,
                        "paragraph_index": p_idx + 1,
                        "content_text": para,
                        "heading": heading or f"صفحة {page_num + 1}",
                        "image_paths": saved_images if p_idx == 0 else [],
                        "has_math": has_math,
                        "has_tables": bool("│" in para or "\t" in para or "|" in para)
                    })

        doc.close()
        return chunks

    @classmethod
    def extract_from_pdf(cls, pdf_path: str, curriculum_id: int) -> List[Dict[str, Any]]:
        return asyncio.run(cls.extract_from_pdf_async(pdf_path, curriculum_id))

    @staticmethod
    def extract_from_docx(docx_path: str, curriculum_id: int) -> List[Dict[str, Any]]:
        doc = Document(docx_path)
        chunks = []
        current_page_estimate = 1
        word_count = 0

        for p_idx, p in enumerate(doc.paragraphs):
            text = p.text.strip()
            if not text:
                continue

            word_count += len(text.split())
            if word_count > 300:
                current_page_estimate += 1
                word_count = 0

            heading = None
            if p.style and "heading" in p.style.name.lower():
                heading = text
            elif len(text) < 100 and ("الفصل" in text or "الوحدة" in text or "الدرس" in text or "Unit" in text):
                heading = text

            has_math = bool(re.search(r'[=∑∫√πθλ±×÷≠≤≥∞\^_{}]', text))

            chunks.append({
                "page_number": current_page_estimate,
                "paragraph_index": p_idx + 1,
                "content_text": text,
                "heading": heading,
                "image_paths": [],
                "has_math": has_math,
                "has_tables": False
            })

        return chunks

    @staticmethod
    def propose_structure(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Group extracted chunks by Unit / Chapter and Lesson.
        """
        chapters = []
        current_chapter = None
        current_lesson = None

        for idx, chunk in enumerate(chunks):
            heading = chunk.get("heading", "")
            text = chunk.get("content_text", "")

            # Check if chunk indicates a new Unit / Chapter
            unit_match = re.search(r'(Unit\s+\d+|الوحدة\s+[\w\d]+|الفصل\s+[\w\d]+|Chapter\s+\d+)', heading or text[:100], re.IGNORECASE)
            lesson_match = re.search(r'(Lesson\s+\d+|الدرس\s+[\w\d]+|المبحث\s+[\w\d]+|Round\s*up|Story\s*time|Project\s*\d*)', heading or text[:100], re.IGNORECASE)

            if unit_match:
                unit_title = unit_match.group(0).strip()
                # Find rest of the line if available
                if current_chapter and current_lesson:
                    current_chapter["lessons"].append(current_lesson)
                if current_chapter and current_chapter["lessons"]:
                    chapters.append(current_chapter)

                current_chapter = {"title": unit_title, "lessons": []}
                current_lesson = {"title": f"مدخل {unit_title}", "chunks_indices": [idx]}

            elif lesson_match and current_chapter:
                lesson_title = lesson_match.group(0).strip()
                if current_lesson and current_lesson["chunks_indices"]:
                    current_chapter["lessons"].append(current_lesson)
                current_lesson = {"title": lesson_title, "chunks_indices": [idx]}

            else:
                if not current_chapter:
                    current_chapter = {"title": "الوحدة الأولى: البداية والتمهيد", "lessons": []}
                if not current_lesson:
                    current_lesson = {"title": "الدرس الأول: مدخل تمهيدي", "chunks_indices": []}
                current_lesson["chunks_indices"].append(idx)

        if current_chapter and current_lesson and current_lesson["chunks_indices"]:
            current_chapter["lessons"].append(current_lesson)
        if current_chapter and current_chapter["lessons"] and current_chapter not in chapters:
            chapters.append(current_chapter)

        if not chapters:
            chapters = [{
                "title": "الفصل الأول",
                "lessons": [{
                    "title": "الدرس الأول",
                    "chunks_indices": list(range(len(chunks)))
                }]
            }]

        return chapters
