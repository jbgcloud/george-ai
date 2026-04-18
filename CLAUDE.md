# george-ai — Project Context

## What this is
George AI — a multimodal chat app built as a learning project. Supports image paste, multi-provider AI (Groq/Anthropic/OpenAI), and persistent per-user memory via localStorage.

## Tech stack
- **Backend:** Node.js + Express (`server.js`)
- **AI:** Groq (default, free) / Anthropic / OpenAI — switchable in-app
- **Frontend:** Plain HTML/CSS/JS (`public/index.html`)
- **Hosting:** GCP Cloud Run (free tier)
- **Repo:** https://github.com/jbgcloud/george-ai
- **Local folder:** `C:\Users\tobit\claude-chat-app\` (folder name not yet renamed)

## Current status (as of 2026-04-19)
- App deployed and live: https://george-ai-870279995346.us-central1.run.app
- All features built and merged to `main`

## What's built
- `POST /chat` — multimodal, provider-routed (Groq/Anthropic/OpenAI), accepts image + summary
- `POST /summarize` — generates running memory summary per user
- Frontend: username modal, settings panel, image paste/preview, End Session button
- localStorage keys: `george-ai-username`, `george-ai-user-{name}`, `george-ai-settings`

### Settings panel fields
| Field | Options | Persisted as |
|---|---|---|
| Provider | Groq / Anthropic / OpenAI | `settings.provider` |
| API Key | text | `settings.apiKey` |
| Model | per-provider list | `settings.model` |
| Font Size | Small / Medium / Large | `settings.fontSize` |
| Theme | Dark / Light | `settings.theme` |

### Mobile UX
- `height: 100dvh` (with `100vh` fallback) — fixes iOS Safari viewport height bug
- `padding-bottom: max(16px, env(safe-area-inset-bottom))` on input area — safe for iPhone notch
- All colors use CSS custom properties; theme toggled via `data-theme` on `<html>`
- `scrollIntoView({ behavior: 'instant', block: 'end' })` on new messages — reliable auto-scroll regardless of layout reflow timing

## Environment variables (`.env`)
- `GROQ_API_KEY` — required for default Groq provider (free tier)
- `PORT` — optional, defaults to 3000

## Owner context
- Jay is learning GitHub and GCP from scratch — explain each step
- Prefer CLI over browser UIs
- Reference global context: `C:/Users/tobit/CLAUDE.md`
- Reference install log: `C:/Users/tobit/SETUP_LOG.md`
