# Proposal: George AI — Multimodal Chat with Provider Switcher and Persistent Memory

## Problem

**George AI** currently supports text-only input, is hardcoded to Groq (`llama-3.3-70b-versatile`), and has no memory between sessions. Users cannot:

1. Paste an image (e.g. a screenshot of a math problem) into the chat and have the AI analyze it.
2. Switch to a different AI provider without editing server code.
3. Return to the app and have the AI remember anything from previous conversations.

## Proposed Solution

### 1. Image paste support
Allow users to paste images directly into the chat input. The image is sent alongside the text message to a vision-capable model. The AI can then read, interpret, and respond to the image content (math problems, diagrams, screenshots, etc.).

### 2. Persistent memory via username + running summary

A simple username prompt on first load identifies the user. Each user's data is stored in `localStorage` — no server or database needed.

Rather than replaying full conversation transcripts (which would exhaust token limits quickly), the app maintains a **running summary** per user. When the user clicks "End Session", the AI reads the current session's messages plus any existing summary, and writes an updated summary capturing what it now knows about the user. On the next session, that summary is silently injected as a system message — the AI feels like it remembers, the chat window starts fresh.

```
localStorage["chat-jay"] = {
  summary: "Jay is building a Node.js chat app...",  ← updated each session end
  currentSession: [{ role, content }, ...]            ← live this session only
}
```

### 3. In-app provider switcher
Add a settings panel in the UI where users can:
- Choose their AI provider (Groq, Claude/Anthropic, OpenAI)
- Enter their API key for the chosen provider
- Select the model within that provider

The selected provider and API key are stored client-side (localStorage) and sent with each request. The backend dynamically routes to the correct SDK based on what the client sends.

## Scope

**In scope:**
- Clipboard paste → image preview → base64 image in message payload
- Backend multimodal message formatting (text + image_url content array)
- Username prompt on first load; stored in localStorage
- Running summary per user stored in localStorage
- Summary injected as system message on each request (invisible to user)
- "End Session" button → AI summarizes → summary saved → currentSession cleared
- Provider switcher UI (settings gear/panel in chat header)
- Backend dynamic routing: Groq / Anthropic / OpenAI
- Vision-capable model defaults per provider:
  - Groq: `llama-3.2-90b-vision-preview` (free)
  - Anthropic: `claude-sonnet-4-6`
  - OpenAI: `gpt-4o`
- API key stored in localStorage (never sent to our server logs)

**Out of scope:**
- Displaying past conversation messages in the chat window
- Cross-device history sync (localStorage is browser-local)
- File upload button (drag-and-drop, file picker) — paste only for now
- Mobile camera input
- Streaming responses

## Default Behavior

The app ships defaulting to **Groq** with `llama-3.2-90b-vision-preview` (free, no key required beyond what's in `.env`). Switching providers requires the user to enter their own API key in the settings panel.

## Why This Matters

A user copying a math problem image from the web, or screenshotting a homework question, should be able to paste it directly into chat without any extra steps. The provider switcher means the app is useful for people with Claude or OpenAI keys too — the app isn't locked to one vendor.

## Why This Matters

A user copying a math problem image from the web, or screenshotting a homework question, should be able to paste it directly into chat. The provider switcher means the app works for anyone with a Claude or OpenAI key. The memory system means the AI builds up knowledge of the user over time — without a database, without auth, without replaying thousands of tokens of history.

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Default provider | Groq | Free, fast, no cost |
| Image transport | base64 in JSON body | Simple, no file storage needed |
| API key storage | localStorage (client) | Never touches our server logs |
| Image input method | Paste only (first iteration) | Lowest complexity, covers main use case |
| Provider list | Groq, Anthropic, OpenAI | The three most common developer APIs |
| History storage | localStorage (client) | No database needed; Cloud Run has no persistent disk |
| History strategy | Running summary, not full transcript | Stays within token limits as conversations grow |
| Session end trigger | Manual "End Session" button | Explicit and reliable; no silent data loss |
| User identity | Simple username (no password) | Enough to key localStorage; no auth complexity |
