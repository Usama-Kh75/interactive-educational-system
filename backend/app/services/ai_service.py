import os
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    @staticmethod
    def get_api_key() -> str:
        key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        return key

    @classmethod
    async def generate_response(
        cls,
        prompt: str,
        context_chunks: List[Dict[str, Any]],
        history: Optional[List[Dict[str, str]]] = None,
        explanation_level: str = "standard",
        allow_external_enrichment: bool = False
    ) -> Dict[str, Any]:
        """
        Grounded AI response generation using Gemini API with exact page references.
        """
        api_key = cls.get_api_key()
        if not api_key:
            return {
                "content": "مفتاح API الخاص بـ Gemini غير مهيأ. يرجى إضافته في إعدادات النظام أو ملف .env.",
                "sources": [],
                "has_external_content": False
            }

        # Build context from chunks
        context_text = ""
        sources = []
        for chunk in context_chunks:
            source_info = {
                "page": chunk.get("page_number", 1),
                "heading": chunk.get("heading") or "مقطع من الدرس",
                "snippet": chunk.get("content_text", "")[:150] + "..."
            }
            sources.append(source_info)
            context_text += f"\n--- [صفحة {source_info['page']} - {source_info['heading']}] ---\n{chunk.get('content_text', '')}\n"

        # System prompt tailoring
        level_instructions = {
            "simple": "اشرح بأسلوب مبسط جداً وواضح يلائم الفهم السريع مع ضرب أمثلة توضيحية بسيطة.",
            "deep": "قدّم شرحاً متعمقاً وتفصيلياً يشمل الخلفيات العلمية والروابط بين المفاهيم.",
            "step_by_step": "قدّم الإجابة على شكل خطوات متسلسلة ومرتبة منطقياً تسهل التطبيق والحل.",
            "standard": "قدّم شرحاً متوازناً ودقيقاً يلتزم بالنص التعليمي."
        }
        level_instruction = level_instructions.get(explanation_level, level_instructions["standard"])

        external_instruction = (
            "إذا لم تجد الإجابة في نصوص المنهج المرفقة، يمكنك الاستعانة بمعلومات خارجية موثوقة بشرط كتابة تنبيه واضح في بداية الإجابة: '[إثراء خارجي]' وتوضيح مصدر المفهوم."
            if allow_external_enrichment else
            "التزم بدقة وحصراً بنصوص المنهج المرفقة أدناه. إذا كان السؤال غير مغطى في المنهج المرفق، صرّح بوضوح: 'هذا الموضوع غير مذكور في المنهج الحالي' ولا تختلق إجابة من عندك."
        )

        system_instruction = f"""أنت معلم ومساعد تعليمي ذكي ومتخصص.
مهمتك مساعدة الطالب في فهم ومراجعة المنهج الدراسي بدقة وأمانة علمية.

القواعد الصارمة:
1. {external_instruction}
2. {level_instruction}
3. عند استخدام معلومة من نص المنهج، أشر إلى رقم الصفحة الأصلية مثلاً: (صفحة X).
4. استخدم لغة عربية فصيحة، واضحة ومحببة للطالب.
5. في المسائل الرياضية أو العلمية، اكتب خطوات الحل بوضوح.
"""

        user_content = f"""نصوص ومراجع المنهج المتاحة:
{context_text}

سؤال الطالب:
{prompt}
"""

        # Construct Gemini API payload
        contents = []
        if history:
            for msg in history[-6:]:  # Keep recent context
                role = "user" if msg["role"] == "user" else "model"
                contents.append({
                    "role": role,
                    "parts": [{"text": msg["content"]}]
                })
        
        contents.append({
            "role": "user",
            "parts": [{"text": user_content}]
        })

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
        
        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 2048,
            }
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        text = "".join([p.get("text", "") for p in parts])
                        return {
                            "content": text,
                            "sources": sources,
                            "has_external_content": "[إثراء خارجي]" in text
                        }
                logger.error(f"Gemini API error: {res.status_code} - {res.text}")
                return {
                    "content": f"تعذر الحصول على إجابة من المساعد الذكي ({res.status_code}). يرجى التحقق من المفتاح أو الاتصال.",
                    "sources": sources,
                    "has_external_content": False
                }
        except Exception as e:
            logger.exception("Error communicating with Gemini")
            return {
                "content": f"حدث خطأ أثناء الاتصال بالمساعد الذكي: {str(e)}",
                "sources": sources,
                "has_external_content": False
            }

    @classmethod
    async def generate_lesson_summary(cls, lesson_title: str, text_content: str) -> Dict[str, Any]:
        """
        Generate smart summary and key concepts for a lesson.
        """
        api_key = cls.get_api_key()
        if not api_key:
            return {"summary": text_content[:300] + "...", "key_concepts": []}

        prompt = f"""قم بإنشاء ملخص تعليمي مركز واستخرج أهم المفاهيم للدرس التالي:
عنوان الدرس: {lesson_title}

محتوى الدرس:
{text_content[:3000]}

أجب بصيغة JSON فقط كالتالي:
{{
  "summary": "ملخص شامل وواضح في فقرة أو فقرتين...",
  "key_concepts": ["مفهوم 1", "مفهوم 2", "مفهوم 3"]
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
        }

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    result = res.json()
                    raw_text = result["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(raw_text)
        except Exception:
            pass

        return {"summary": text_content[:250] + "...", "key_concepts": []}

    @classmethod
    async def generate_quiz_questions(
        cls,
        lesson_title: str,
        text_content: str,
        count: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Generate practice questions (MCQ) strictly based on lesson content.
        """
        api_key = cls.get_api_key()
        if not api_key:
            return []

        prompt = f"""بناءً على محتوى الدرس التالي فقط، أنشئ عدد {count} أسئلة اختيار من متعدد للتدريب:
عنوان الدرس: {lesson_title}

نص الدرس:
{text_content[:4000]}

أجب بصيغة JSON مصفوفة من العناصر كالتالي:
[
  {{
    "question_text": "نص السؤال هنا؟",
    "question_type": "multiple_choice",
    "options": ["خيار أ", "خيار ب", "خيار ج", "خيار د"],
    "correct_answer": "خيار أ",
    "explanation": "شرح سبب الإجابة مع الإشارة لموضعها في الدرس",
    "difficulty": "medium"
  }}
]
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.3}
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    result = res.json()
                    raw_text = result["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Error generating questions: {e}")
            return []
        return []
