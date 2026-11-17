
const axios = require('axios');

const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey() {
  return process.env.GEMINI_API_KEY;
}

function getModel() {
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
}

function isApiConfigured() {
  return Boolean(getApiKey() && getApiKey().trim());
}

async function generateContent(
  contents,
  systemPrompt,
  maxOutputTokens = 1024,
  timeout = 45000
) {
  if (!isApiConfigured()) {
    throw new Error('Gemini API key is not configured.');
  }

  const payload = {
    contents,
    generationConfig: {
      maxOutputTokens,
    },
  };

  if (systemPrompt) {
    payload.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  const url = `${GEMINI_BASE_URL}/${getModel()}:generateContent`;

  const response = await axios.post(url, payload, {
    params: { key: getApiKey() },
    headers: { 'Content-Type': 'application/json' },
    timeout,
  });

  const parts =
    response.data?.candidates?.[0]?.content?.parts || [];

  const result = parts
    .map((part) => part.text || '')
    .join('')
    .trim();

  if (!result) {
    throw new Error(
      'Gemini returned an empty response. The request may have been blocked.'
    );
  }

  return result;
}

async function chat(messages, systemPrompt) {
  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(message.content || '') }],
  }));

  return generateContent(contents, systemPrompt, 1024, 30000);
}

async function simplifyText(text, level, language) {
  const levels = {
    simple: 'Use simpler language and shorter sentences.',
    'very-simple': 'Use very simple words and short sentences suitable for a 10-year-old.',
    'step-by-step': 'Convert the text into a clear numbered step-by-step list.',
  };

  const languages = {
    english: 'Respond in English.',
    hindi: 'Respond in Hindi using Devanagari script.',
  };

  const systemPrompt = `You make complex information accessible to everyone. ${levels[level] || levels.simple} ${languages[language] || languages.english} Preserve the original meaning and do not invent information.`;

  return chat(
    [{ role: 'user', content: text }],
    systemPrompt
  );
}

async function describeImage(imageBase64, mimeType) {
  const prompt = `Describe this image for someone who cannot see it.

Provide:
SHORT: A concise 1-2 sentence description.

DETAILED: Describe the main objects, people, actions, setting, colors, lighting, spatial relationships and readable text.

Do not identify specific individuals or assume sensitive personal characteristics. Mention that AI descriptions may not be fully accurate.`;

  const contents = [{
    role: 'user',
    parts: [
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      { text: prompt },
    ],
  }];

  return generateContent(contents, null, 1024, 45000);
}

async function accessibilityWorkflow(imageBase64, mimeType) {
  const prompt = `Analyze this image and provide a complete accessibility report.

IMAGE DESCRIPTION:
Describe the main subjects, setting, colors and spatial layout. Do not identify specific individuals.

VISIBLE TEXT:
List all readable text. If none is visible, say "No readable text detected."

SIMPLIFIED SUMMARY:
Explain the main content using simple vocabulary and short sentences.

KEY INFORMATION:
Extract 3-5 important points in bullet form.

Use clear headings for all four sections.`;

  const contents = [{
    role: 'user',
    parts: [
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      { text: prompt },
    ],
  }];

  return generateContent(contents, null, 1500, 60000);
}

module.exports = {
  chat,
  simplifyText,
  describeImage,
  accessibilityWorkflow,
  isApiConfigured,
};
