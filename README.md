# AI Joke Generator

## Project Description

A web app that generates jokes on demand using Google's Gemini AI. Users pick a joke category (Dad Jokes, Puns, Dark Humor, Knock-knock, Surreal) and/or type optional keywords, then hit Generate to get a joke. Previously generated jokes are saved in the browser so the history persists across page reloads. The history can be cleared at any time.

---

## Architecture Overview

```
Browser (React SPA)
       │
       │  POST /generate  { category, keywords }
       ▼
FastAPI Backend (Python)
  - builds the prompt
  - enforces rate limiting (10 req/min per IP)
  - calls Gemini API
       │
       ▼
Google Gemini API
  - returns generated joke text
       │
       ▼
FastAPI → { joke: "..." } → React → localStorage
```

The frontend never talks to Gemini directly — all AI calls go through the backend, which keeps the API key server-side only.

---

## Technical Choices

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 18 + Vite | Fast dev server, minimal config, standard for SPAs |
| Testing (frontend) | Vitest + jsdom | Built into the Vite ecosystem, no separate Jest config needed |
| Backend | Python + FastAPI | Required by the course; FastAPI gives automatic request validation via Pydantic and async support with minimal boilerplate |
| AI SDK | `google-genai` | Official Google SDK for Gemini; the older `google-generativeai` package is deprecated |
| Rate limiting | slowapi | One-decorator rate limiting for FastAPI, per-IP out of the box |
| Env management | python-dotenv | Standard way to load `.env` files in Python without exposing secrets |
| Persistence | localStorage | No database needed — history is per-browser and doesn't need to survive server restarts |

---

## Setup and Running Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key (free tier)

### 1. Clone the repository

```bash
git clone <repo-url>
cd recipe-generator
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env` (gitignored):

```
GEMINI_API_KEY=your_api_key_here
```

### 3. Install frontend dependencies

```bash
# from the project root
cd ..
npm install
```

### 4. Run the app

**Terminal 1 — backend:**

```bash
cd backend
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

**Terminal 2 — frontend:**

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`. Open that URL in your browser.

### 5. Run the tests

```bash
# Frontend
npx vitest run

# Backend
cd backend
venv\Scripts\activate
python -m pytest tests/ -v
```

---

## Known Limitations

- **Model availability is unpredictable on the free tier.** Some Gemini models return 503 (high demand) depending on the day. The model name is hardcoded in `backend/app/main.py` (`GEMINI_MODEL`) and may need to be changed if the current one becomes unavailable.

- **No input validation on keywords.** Any string is sent to Gemini as-is. In production this should be sanitised and length-limited.

- **CORS is locked to localhost.** `http://localhost:5173` and `http://localhost:4173` are the only allowed origins. Deploying the frontend anywhere else requires updating the `allow_origins` list in `backend/app/main.py`.

- **Rate limit is per-IP in memory only.** The slowapi limiter resets when the server restarts and does not persist across multiple backend instances. Not suitable for a multi-process or multi-server deployment.

- **History is browser-local.** Joke history is stored in the browser's `localStorage`. It is not shared between devices and is lost if the user clears browser data.

- **No authentication.** Anyone who can reach the backend URL can call `/generate` and consume the API quota.

---

## AI Tools Used

This project was built with significant help from **Claude (Anthropic)** via Claude Code:

- Generated an implementation plan broken into 15 tasks with TDD steps
- Wrote the majority of the code (backend and frontend), including all test files

The developer directed the design decisions (full-stack architecture, categories, localStorage persistence, rate limiting approach, model selection) and reviewed and approved each implementation step.
