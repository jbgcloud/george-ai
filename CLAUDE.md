# george-ai — Project Context

## What this is
A simple Claude AI chat web app built as a learning project. The goal is to learn GitHub workflows and GCP deployment while building something real.

## Tech stack (planned)
- **Backend:** Node.js + Express
- **AI:** Claude API (Anthropic SDK) — chat endpoint
- **Frontend:** Plain HTML/CSS/JS (simple chat UI)
- **Hosting:** GCP Cloud Run (free tier)
- **Repo:** https://github.com/jbgcloud/george-ai

## Current status (as of 2026-04-18)
- Repo created on GitHub and cloned locally
- App not built yet — this is the starting point

## What to build next
1. `npm init` and install dependencies (`express`, `@anthropic-ai/sdk`, `dotenv`)
2. Create `server.js` — Express server with a `/chat` POST endpoint calling Claude API
3. Create `public/index.html` — basic chat UI
4. Add `.env` for `ANTHROPIC_API_KEY` (never commit this)
5. Add `.gitignore` (exclude `node_modules/`, `.env`)
6. Test locally, then push to GitHub
7. Set up GCP Cloud Run deployment

## Owner context
- Jay is learning GitHub and GCP from scratch — explain each step
- Prefer CLI over browser UIs
- Reference global context: `C:/Users/tobit/CLAUDE.md`
- Reference install log: `C:/Users/tobit/SETUP_LOG.md`
