require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.static('public'));

const ALLOWED_PROVIDERS = ['groq', 'anthropic', 'openai'];

const MODEL_DEFAULTS = {
  groq: 'llama-3.3-70b-versatile',
  anthropic: 'claude-sonnet-4-6',
  openai: 'gpt-4o',
};

const GROQ_VISION_MODEL = 'llama-3.2-90b-vision-preview';

function buildClient(provider, apiKey) {
  switch (provider) {
    case 'anthropic': return new Anthropic({ apiKey });
    case 'openai': return new OpenAI({ apiKey });
    default: return new Groq({ apiKey: apiKey || process.env.GROQ_API_KEY });
  }
}

function buildContent(text, image, provider) {
  if (!image) return text;

  const textPart = { type: 'text', text: text || '' };

  if (provider === 'anthropic') {
    return [
      { type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.data } },
      textPart,
    ];
  }

  // Groq and OpenAI use image_url format
  return [
    { type: 'image_url', image_url: { url: `data:${image.mediaType};base64,${image.data}` } },
    textPart,
  ];
}

async function callProvider(provider, client, model, systemMessage, messages) {
  if (provider === 'anthropic') {
    const res = await client.messages.create({
      model,
      max_tokens: 4096,
      ...(systemMessage ? { system: systemMessage } : {}),
      messages,
    });
    return res.content[0].text;
  }

  // Groq and OpenAI share the chat.completions interface
  const allMessages = [
    ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
    ...messages,
  ];
  const res = await client.chat.completions.create({ model, messages: allMessages });
  return res.choices[0].message.content;
}

app.post('/chat', async (req, res) => {
  const { message, image, history, provider: rawProvider, apiKey, model: rawModel, summary } = req.body;

  if (!message && !image) return res.status(400).json({ error: 'message or image is required' });

  const provider = ALLOWED_PROVIDERS.includes(rawProvider) ? rawProvider : 'groq';
  let model = rawModel || MODEL_DEFAULTS[provider];
  if (provider === 'groq' && image) model = GROQ_VISION_MODEL;

  const client = buildClient(provider, apiKey);
  const content = buildContent(message, image, provider);

  const messages = [
    ...(history || []).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content },
  ];

  try {
    const reply = await callProvider(provider, client, model, summary || null, messages);
    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/summarize', async (req, res) => {
  const { currentSession, existingSummary, provider: rawProvider, apiKey, model: rawModel } = req.body;

  if (!currentSession || currentSession.length === 0) {
    return res.status(400).json({ error: 'currentSession is required' });
  }

  const provider = ALLOWED_PROVIDERS.includes(rawProvider) ? rawProvider : 'groq';
  // Use text-only model for summarization even if vision model is active
  const model = rawModel && provider !== 'groq' ? rawModel : MODEL_DEFAULTS[provider];
  const client = buildClient(provider, apiKey);

  const systemMessage = 'You are a memory assistant. Given the conversation below and any existing summary, produce a concise updated summary (3–5 sentences) of what you know about this user — their goals, preferences, ongoing projects, and anything useful to remember. Output only the summary text, nothing else.';

  const userPrompt = [
    existingSummary ? `Existing summary:\n${existingSummary}\n` : '',
    'Conversation to incorporate:',
    ...currentSession.map(m => `${m.role}: ${typeof m.content === 'string' ? m.content : '[image]'}`),
  ].filter(Boolean).join('\n');

  const messages = [{ role: 'user', content: userPrompt }];

  try {
    const summary = await callProvider(provider, client, model, systemMessage, messages);
    res.json({ summary });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
