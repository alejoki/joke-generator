# AI Joke Generator — Design Spec

**Date:** 2026-04-19

## Overview

A single-page React (Vite) app that generates jokes via the Google Gemini API. Users select a joke type and/or enter keywords, then click Generate. All generated jokes are stored in the browser's localStorage as a scrollable history.

## Features

### Joke Input
- **Category pills:** Dad Jokes, Puns, Dark Humor, Knock-knock, Surreal. One pill selected at a time (highlighted); deselecting a pill means no category filter.
- **Keyword field:** Optional free-text input (e.g. "santa, reindeer, gifts"). Works independently of or combined with a category.
- **Generate button:** Disabled while a request is in flight. Shows a loading state (spinner or pulsing text).

### Joke Display
- The most recently generated joke is shown in a prominent card below the input.
- The card shows the joke text and a tag indicating which category was used (or "Custom" if only keywords were used).

### History
- Every generated joke is prepended to a history list rendered below the current joke card.
- Each history item shows a truncated joke preview and its category tag.
- Persisted in `localStorage` under a single key. No server, no auth.
- A "Clear history" link empties the list after confirmation.

## Architecture

**Stack:** React 18, Vite, `@google/generative-ai` SDK.

**No backend.** The Gemini API is called directly from the browser using the key from `VITE_GEMINI_API_KEY`.

**Model:** `gemini-1.5-flash` — fast and cheap for short text generation.

**Prompt construction:** A single utility function builds the Gemini prompt from `{ category, keywords }`. If both are provided, they are combined ("Tell me a [category] joke about [keywords]"). If only keywords, the prompt asks for a joke on that topic. Category alone asks for a joke of that type.

**State:** All state is local to `App`. No global store needed.
- `selectedCategory: string | null`
- `keywords: string`
- `currentJoke: { text, category } | null`
- `history: Array<{ id, text, category, timestamp }>` — initialised from localStorage, persisted on every update via `useEffect`.
- `loading: boolean`
- `error: string | null`

**Component tree:**
```
App
├── Header
├── CategoryPills        — pill buttons, calls onSelect(category)
├── KeywordInput         — controlled input + Generate button
├── JokeCard             — displays currentJoke, hidden until first generation
└── JokeHistory          — list of past jokes + Clear History
```

## Error Handling

- API errors surface as a short inline message below the Generate button ("Something went wrong, try again").
- Empty response from Gemini (rare): treated the same as an API error.
- No retry logic — user just clicks Generate again.

## Data Flow

1. User selects category and/or types keywords → local state updated.
2. User clicks Generate → `loading = true`, prompt built, Gemini API called.
3. On success → `currentJoke` set, joke prepended to `history`, localStorage written, `loading = false`.
4. On failure → `error` set, `loading = false`.

## Environment

```
VITE_GEMINI_API_KEY=your_key_here
```

`.env` is gitignored. A `.env.example` file will be committed as reference.
