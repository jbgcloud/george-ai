## 1. Dependencies

- [x] 1.1 Install openai npm package

## 2. Backend — Provider Routing

- [x] 2.1 Refactor server.js to accept provider, apiKey, and model fields in /chat request body
- [x] 2.2 Add dynamic client factory that instantiates Groq, Anthropic, or OpenAI SDK based on provider
- [x] 2.3 Add provider-specific chat completion call (Groq/OpenAI use chat.completions, Anthropic uses messages.create with separate system param)
- [x] 2.4 Validate provider field against allowed list (groq, anthropic, openai)

## 3. Backend — Multimodal Support

- [x] 3.1 Accept optional image field (base64 data + mediaType) in /chat request body
- [x] 3.2 Build multimodal content array for Groq/OpenAI (image_url format)
- [x] 3.3 Build multimodal content array for Anthropic (image source format)
- [x] 3.4 Auto-upgrade model to llama-3.2-90b-vision-preview when provider is groq and image is present

## 4. Backend — Summary Support

- [x] 4.1 Accept optional summary field in /chat request body and inject as system message
- [x] 4.2 Add /summarize POST endpoint that accepts currentSession + existingSummary and returns updated summary using the active provider

## 5. Frontend — Username Flow

- [x] 5.1 Add username modal overlay shown on load when no username in localStorage
- [x] 5.2 Save username to localStorage (key: george-ai-username) on confirm
- [x] 5.3 Load existing user data from localStorage on username entry and skip modal for returning users

## 6. Frontend — Settings Panel

- [x] 6.1 Add settings gear icon to header
- [x] 6.2 Build settings panel with provider dropdown (Groq, Anthropic, OpenAI)
- [x] 6.3 Add API key input field and model selector that updates based on selected provider
- [x] 6.4 Save settings to localStorage (key: george-ai-settings) on save and close panel

## 7. Frontend — Image Paste

- [x] 7.1 Add paste event listener that detects image data in clipboard
- [x] 7.2 Convert pasted image to base64 and store in memory
- [x] 7.3 Show image thumbnail preview above textarea with × remove button
- [x] 7.4 Include image data in /chat POST payload when present, clear after send

## 8. Frontend — Persistent Memory

- [x] 8.1 Inject stored summary as part of each /chat request
- [x] 8.2 Save each message pair to currentSession in localStorage after every exchange
- [x] 8.3 Add End Session button to header
- [x] 8.4 On End Session click: call /summarize, save updated summary, clear currentSession and chat window
- [x] 8.5 Disable End Session button when no messages have been sent this session
