const grokService = require('../services/grokService');

// Demo content for when API key is not configured
const DEMO_CONTENT = {
  chat: {
    response: `[DEMO MODE] Hello! I'm AccessEase AI, your accessibility companion. I'm currently running in demo mode because the Grok API key hasn't been configured yet.

In live mode, I can help you with:
• Answering questions about any topic
• Describing what's around you
• Explaining complex information simply
• Assisting with daily digital tasks

To enable full AI capabilities, please add your xAI API key to the server's .env file.`,
    isDemo: true,
  },
  simplify: {
    result: `[DEMO MODE] Here is a sample simplified version of your text:

This is an example of simplified text. The original content has been rewritten using easier words and shorter sentences. Each idea is explained clearly so everyone can understand it.

Key points:
• Complex words have been replaced with simple ones
• Long sentences have been broken into shorter ones
• The main meaning has been preserved

Note: This is demo content. Configure the Grok API key to get real AI simplifications.`,
    isDemo: true,
  },
  imageDescription: {
    short: '[DEMO MODE] A sample image has been uploaded showing various elements in a visual scene.',
    detailed: `[DEMO MODE] This is a demonstration image description. In live mode with the Grok API configured, this section would contain:

• A detailed description of the main subjects in the image
• Description of colors, lighting, and atmosphere
• Information about spatial relationships between objects
• Any visible text found in the image
• Overall context and setting

Note: This is demo content. Configure your xAI API key to enable real AI image descriptions.`,
    isDemo: true,
  },
  workflow: {
    imageDescription: '[DEMO MODE] Sample image showing a document or scene with text and visual elements.',
    visibleText: 'No readable text detected in this demo. In live mode, the AI would extract any visible text from your image.',
    simplifiedSummary: 'This is a demonstration of the One-Click Accessibility Mode. When configured with the Grok API, this feature analyzes your image, extracts text, and presents everything in an easy-to-read format.',
    keyInformation: [
      'This is a demo of the accessibility workflow feature',
      'Configure your xAI API key to enable real analysis',
      'The workflow combines image description, text extraction, and simplification',
      'Results can be read aloud using the text-to-speech feature',
    ],
    isDemo: true,
  },
};

/**
 * POST /api/ai/chat
 * Voice assistant conversation
 */
async function handleChat(req, res) {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long. Maximum 2000 characters.' });
    }

    if (!grokService.isApiConfigured()) {
      return res.json(DEMO_CONTENT.chat);
    }

    const systemPrompt = `You are AccessEase AI, a friendly and helpful accessibility companion. Your mission is to help people with disabilities and anyone who needs assistance interact with digital content. 

Be concise, clear, and use simple language. If someone asks you to describe something, be detailed. If they need help understanding something, explain it simply. Always be patient and supportive.`;

    const messages = [
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message.trim() },
    ];

    const responseText = await grokService.chat(messages, systemPrompt);

    res.json({ response: responseText, isDemo: false });
  } catch (error) {
    console.error('Chat error:', error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your xAI API configuration.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment before trying again.' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timed out. Please try again.' });
    }
    res.status(500).json({ error: 'An error occurred while processing your request. Please try again.' });
  }
}

/**
 * POST /api/ai/simplify
 * Text simplification
 */
async function handleSimplify(req, res) {
  try {
    const { text, level = 'simple', language = 'english' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string.' });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty.' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 5000 characters.' });
    }

    const validLevels = ['simple', 'very-simple', 'step-by-step'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: `Invalid simplification level. Must be one of: ${validLevels.join(', ')}` });
    }

    const validLanguages = ['english', 'hindi'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ error: `Invalid language. Supported: ${validLanguages.join(', ')}` });
    }

    if (!grokService.isApiConfigured()) {
      return res.json(DEMO_CONTENT.simplify);
    }

    const result = await grokService.simplifyText(text.trim(), level, language);

    res.json({ result, isDemo: false });
  } catch (error) {
    console.error('Simplify error:', error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment.' });
    }
    res.status(500).json({ error: 'An error occurred while simplifying your text. Please try again.' });
  }
}

/**
 * POST /api/ai/describe-image
 * AI image description
 */
async function handleDescribeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const { buffer, mimetype } = req.file;
    const imageBase64 = buffer.toString('base64');

    if (!grokService.isApiConfigured()) {
      return res.json(DEMO_CONTENT.imageDescription);
    }

    const descriptionText = await grokService.describeImage(imageBase64, mimetype);

    // Parse short and detailed from the structured response
    let short = '';
    let detailed = '';

    const shortMatch = descriptionText.match(/SHORT:\s*([\s\S]*?)(?=\n\nDETAILED:|$)/i);
    const detailedMatch = descriptionText.match(/DETAILED:\s*([\s\S]*?)$/i);

    short = shortMatch ? shortMatch[1].trim() : descriptionText.substring(0, 200);
    detailed = detailedMatch ? detailedMatch[1].trim() : descriptionText;

    res.json({ short, detailed, isDemo: false });
  } catch (error) {
    console.error('Image description error:', error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment.' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Image analysis timed out. Please try a smaller image.' });
    }
    res.status(500).json({ error: 'An error occurred while analyzing the image. Please try again.' });
  }
}

/**
 * POST /api/ai/accessibility-workflow
 * One-Click Accessibility Mode
 */
async function handleAccessibilityWorkflow(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const { buffer, mimetype } = req.file;
    const imageBase64 = buffer.toString('base64');

    if (!grokService.isApiConfigured()) {
      return res.json(DEMO_CONTENT.workflow);
    }

    const rawResult = await grokService.accessibilityWorkflow(imageBase64, mimetype);

    // Parse structured sections
    const parseSection = (text, header, nextHeader) => {
      const regex = nextHeader
        ? new RegExp(`${header}:\\s*([\\s\\S]*?)(?=${nextHeader}:|$)`, 'i')
        : new RegExp(`${header}:\\s*([\\s\\S]*)$`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const imageDescription = parseSection(rawResult, 'IMAGE DESCRIPTION', 'VISIBLE TEXT');
    const visibleText = parseSection(rawResult, 'VISIBLE TEXT', 'SIMPLIFIED SUMMARY');
    const simplifiedSummary = parseSection(rawResult, 'SIMPLIFIED SUMMARY', 'KEY INFORMATION');
    const keyInfoRaw = parseSection(rawResult, 'KEY INFORMATION', null);

    // Parse bullet points from key information
    const keyInformation = keyInfoRaw
      .split('\n')
      .map((line) => line.replace(/^[\-\*\•]\s*/, '').trim())
      .filter((line) => line.length > 0);

    res.json({
      imageDescription,
      visibleText,
      simplifiedSummary,
      keyInformation,
      isDemo: false,
    });
  } catch (error) {
    console.error('Workflow error details:', {
  message: error.message,
  status: error.response?.status,
  data: error.response?.data,
  code: error.code,
});
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment.' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timed out. Please try again with a smaller image.' });
    }
    res.status(500).json({ error: 'An error occurred during the accessibility workflow. Please try again.' });
  }
}

module.exports = {
  handleChat,
  handleSimplify,
  handleDescribeImage,
  handleAccessibilityWorkflow,
};
