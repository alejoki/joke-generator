# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI Joke Generator — React frontend that calls the Google Gemini API to generate jokes on demand.

## Commands

```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Architecture

Single-page React app (Vite) with no backend — Gemini API is called directly from the browser using `@google/generative-ai`.

**Key design decisions:**
- API key is stored in `.env` as `VITE_GEMINI_API_KEY` and accessed via `import.meta.env`
- Gemini model used: `gemini-1.5-flash` (fast, low-cost for short generation tasks)
- State is local to components — no global store needed for this scope

## Environment

Create a `.env` file at the project root:

```
VITE_GEMINI_API_KEY=your_key_here
```
