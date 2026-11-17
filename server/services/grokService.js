const axios = require('axios');

const XAI_BASE_URL = 'https://api.x.ai/v1';

function getApiKey() {
  return process.env.XAI_API_KEY;
}

function getModel() {
  return process.env.XAI_MODEL || 'grok-2-vision-1212';
}

function isApiConfigured() {
  const key = getApiKey();
  return key && key.trim() !== '' && key !== 'your_xai_api_key_here';
}

/**
 * Send a text chat message to Grok
 */
async function chat(messages, systemPrompt) {
  if (!isApiConfigured()) {
    return null; // Caller handles demo mode
  }

  const payload = {
    model: getModel(),
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  const response = await axios.post(`${XAI_BASE_URL}/chat/completions`, payload, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  return response.data.choices[0].message.content;
}

/**
 * Simplify text using Grok
 */
async function simplifyText(text, level, language) {
  const levelInstructions = {
    simple: 'Rewrite the following text using simpler language. Keep the same level of detail but use easier words and shorter sentences.',
    'very-simple': 'Rewrite the following text in very simple language suitable for a 10-year-old. Use extremely common words, very short sentences, and avoid all jargon.',
    'step-by-step': 'Convert the following text into a clear numbered step-by-step list. Each step should be a single simple action or idea.',
  };

  const languageInstructions = {
    english: 'Respond in English.',
    hindi: 'Respond in Hindi (Devanagari script).',
  };

  const systemPrompt = `You are an expert at making complex information accessible to everyone. ${levelInstructions[level] || levelInstructions.simple} ${languageInstructions[language] || languageInstructions.english} Preserve all important meaning. Do not add information that was not in the original. If the text contains medical, legal, or financial information, add a brief disclaimer at the end that your simplification does not replace professional advice.`;

  return chat([{ role: 'user', content: text }], systemPrompt);
}

/**
 * Generate an image description using Grok vision
 */
async function describeImage(imageBase64, mimeType) {
  if (!isApiConfigured()) {
    return null;
  }

  const payload = {
    model: getModel(),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
          {
            type: 'text',
            text: `Please provide two descriptions of this image:

1. SHORT DESCRIPTION: A concise 1-2 sentence overview of what the image shows.

2. DETAILED DESCRIPTION: A thorough description covering:
- Main objects, subjects, or people (describe actions and appearance, but do not identify specific individuals)
- Setting and environment
- Colors and lighting
- Spatial relationships between elements
- Any visible text that is legible
- Overall mood or atmosphere

Important guidelines:
- Do not identify or name specific individuals
- Do not make assumptions about sensitive personal characteristics
- Note that this description is AI-generated and may not be fully accurate
- Be descriptive and helpful for someone who cannot see the image

Format your response exactly as:
SHORT: [your short description]

DETAILED: [your detailed description]`,
          },
        ],
      },
    ],
    max_tokens: 1024,
  };

  const response = await axios.post(`${XAI_BASE_URL}/chat/completions`, payload, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    timeout: 45000,
  });

  return response.data.choices[0].message.content;
}

/**
 * Run the full accessibility workflow on an image
 */
async function accessibilityWorkflow(imageBase64, mimeType) {
  if (!isApiConfigured()) {
    return null;
  }

  const payload = {
    model: getModel(),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
          {
            type: 'text',
            text: `Analyze this image and provide a complete accessibility report with the following sections:

IMAGE DESCRIPTION:
Describe what you see in the image including main subjects, setting, colors, and spatial layout. Do not identify specific individuals.

VISIBLE TEXT:
List any text visible in the image. If no text is visible, say "No readable text detected."

SIMPLIFIED SUMMARY:
Provide a simplified, easy-to-read summary of the main content in this image using simple vocabulary and short sentences suitable for all reading levels.

KEY INFORMATION:
Extract the 3-5 most important pieces of information from this image in bullet points.

Please format each section clearly with its header followed by the content.`,
          },
        ],
      },
    ],
    max_tokens: 1500,
  };

  const response = await axios.post(`${XAI_BASE_URL}/chat/completions`, payload, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  });

  return response.data.choices[0].message.content;
}

module.exports = { chat, simplifyText, describeImage, accessibilityWorkflow, isApiConfigured };
