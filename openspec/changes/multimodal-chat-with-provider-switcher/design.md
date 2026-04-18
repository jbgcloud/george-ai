# Design: George AI — Multimodal Chat with Provider Switcher and Persistent Memory

## Context

**Current state:**
- `server.js`: Express server, Groq SDK only, accepts `{ message, history }`, returns `{ reply }`
- `public/index.html`: Single file, inline CSS/JS, plain textarea, no persistence
- No username, no image support, no provider selection

**Constraints:**
- Deployment target is GCP Cloud Run (stateless — no persistent disk)
- Default provider must be free (Groq)
- No backend database — all user data lives in browser localStorage
- Single HTML file frontend (no build step)

---

## Goals / Non-Goals

**Goals:**
- Users can paste an image + text and have the AI respond to both
- Users can switch AI provider (Groq / Anthropic / OpenAI) from within the UI
- The AI remembers past conversations via a running summary keyed to a username
- App works out of the box with no configuration (Groq default)

**Non-Goals:**
- Persisting chat history visually across sessions
- Cross-device or cross-browser sync
- File picker / drag-and-drop image upload
- User authentication or passwords
- Streaming responses

---

## Decisions

### 1. Image transport: base64 in JSON body

Pasted images are converted to base64 and sent in the POST body alongside the message text. No file uploads, no server-side storage.

**Why over multipart/form-data:** Keeps the request format consistent. The existing `/chat` endpoint already accepts JSON — extending it with an optional `image` field is minimal change.

**Tradeoff:** Base64 inflates image size by ~33%. Acceptable for occasional screenshots; would be a problem for bulk image sending (out of scope).

### 2. Multimodal content format differs per provider

Each provider uses a different format for image content in messages:

```
Groq (OpenAI-compatible):
  { type: "image_url", image_url: { url: "data:image/png;base64,..." } }

Anthropic:
  { type: "image", source: { type: "base64", media_type: "image/png", data: "..." } }

OpenAI:
  { type: "image_url", image_url: { url: "data:image/png;base64,..." } }
```

The backend builds the content array after routing to the correct provider.

### 3. Provider routing on the backend

The client sends `{ provider, apiKey, model }` with every request. The backend instantiates the correct SDK client dynamically:

```
provider = "groq"       → Groq SDK,      apiKey from body OR process.env.GROQ_API_KEY
provider = "anthropic"  → Anthropic SDK, apiKey from body
provider = "openai"     → OpenAI SDK,    apiKey from body
```

**Why client sends the key:** Keeps the server stateless and free of per-user config. The server never logs or stores the key.

**Anthropic API difference:** Unlike Groq/OpenAI (`chat.completions.create`), Anthropic uses `messages.create` with a separate `system` parameter. The backend must handle this branching.

### 4. Vision model auto-upgrade (Groq only)

When an image is present and the provider is Groq, the model is automatically switched to `llama-3.2-90b-vision-preview` regardless of what model is selected — because the default text model does not support vision.

Anthropic and OpenAI vision is handled by the same model as text (`claude-sonnet-4-6`, `gpt-4o`), so no auto-upgrade needed.

### 5. Summarization reuses `/chat` endpoint with injected prompt

Rather than a separate `/summarize` endpoint, the "End Session" flow sends a special request to `/chat` with a system prompt instructing the model to produce a summary. This avoids duplicating provider-routing logic.

**Summary prompt:**
> "You are a memory assistant. Given the conversation below and any existing summary, produce a concise updated summary (3–5 sentences) of what you know about this user — their goals, preferences, ongoing projects, and anything useful to remember. Output only the summary, no other text."

### 6. localStorage schema

All user data keyed by username. Settings stored separately.

```
george-ai-username          → "jay"   (string)

george-ai-user-jay          → JSON:
  {
    summary: "Jay is building...",
    currentSession: [{ role, content }, ...]
  }

george-ai-settings          → JSON:
  {
    provider: "groq",
    apiKey: "",
    model: "llama-3.3-70b-versatile"
  }
```

### 7. Model defaults per provider

| Provider | Text model | Vision model |
|---|---|---|
| Groq | `llama-3.3-70b-versatile` | `llama-3.2-90b-vision-preview` (auto) |
| Anthropic | `claude-sonnet-4-6` | `claude-sonnet-4-6` (same) |
| OpenAI | `gpt-4o` | `gpt-4o` (same) |

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Base64 image too large for Groq free tier limits | Show an error message if the API returns a payload size error |
| localStorage cleared by user → summary lost | Acceptable for a personal learning project; out of scope to fix |
| Client sends arbitrary `provider`/`model` values | Backend validates `provider` against allowed list (`groq`, `anthropic`, `openai`) |
| Anthropic SDK not installed | Already present in `package.json` dependencies |
| OpenAI SDK not installed | Must be added: `npm install openai` |
| `llama-3.2-90b-vision-preview` deprecated/renamed on Groq | Fail gracefully with a clear error; model name configurable in settings |

---

## Migration Plan

1. Install `openai` npm package
2. Update `server.js` — add provider routing, multimodal support, summarize support
3. Update `public/index.html` — add username modal, settings panel, image paste/preview, End Session button
4. Test locally with Groq (free, no extra key needed)
5. Push to GitHub; deploy to Cloud Run

No database migrations. No breaking changes to existing `.env` — `GROQ_API_KEY` continues to work as before.

---

## Open Questions

- None — all decisions made during explore phase.
