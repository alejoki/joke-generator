import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from app.prompt import build_prompt

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

GEMINI_MODEL = "gemini-3.1-flash-lite"

_genai_client = None


def _get_client():
    global _genai_client
    if _genai_client is None:
        _genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _genai_client


class _Model:
    def generate_content(self, prompt: str):
        return _get_client().models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )


model = _Model()


class GenerateRequest(BaseModel):
    category: str | None = None
    keywords: str = ""


@app.post("/generate")
@limiter.limit("20/minute")
async def generate(request: Request, body: GenerateRequest):
    prompt = build_prompt(body.category, body.keywords)
    try:
        response = model.generate_content(prompt)
        joke = response.text.strip()
        if not joke:
            return JSONResponse(status_code=502, content={"detail": "Empty response from Gemini"})
        return {"joke": joke}
    except Exception:
        return JSONResponse(status_code=502, content={"detail": "Gemini request failed"})
