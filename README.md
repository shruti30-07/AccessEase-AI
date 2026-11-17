# AccessEase AI — Technology Without Barriers

> **Built for the CURSORFLOW: AI Insights to Innovation Hackathon**
>
> An AI-powered accessibility platform helping people with disabilities interact with digital content through voice, audio, image understanding, and simplified language.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Assistant** | Speak naturally and get AI-powered responses using the Grok API |
| 🔊 **Text to Speech** | Listen to any text with adjustable speed and voice selection |
| 📝 **Speech to Text** | Convert spoken words to editable, downloadable text |
| 🖼️ **AI Image Description** | Upload images and receive detailed AI-generated visual descriptions |
| ⚡ **Simplify Information** | Make complex text easy to understand — 3 levels, 2 languages |
| ♿ **One-Click Mode** | Signature feature: image → description → text → summary → audio → Q&A |
| ⚙️ **Accessibility Settings** | Font size, dark mode, high contrast, dyslexia font, reduced motion & more |

---

## 🏗️ Tech Stack

**Frontend:** React 18 · Vite · React Router · Lucide React · Axios

**Backend:** Node.js · Express.js · Multer · Axios · CORS

**AI:** xAI Grok API (grok-2-vision-1212) via server-side REST calls

**Browser APIs:** Web Speech API (recognition) · SpeechSynthesis API (TTS)

---

## 📁 Project Structure

```
accessease/
  client/                 ← React + Vite frontend (port 5173)
    src/
      components/         ← Shared UI components
      context/            ← AccessibilityContext (global preferences)
      hooks/              ← useSpeechRecognition, useTextToSpeech
      pages/              ← Route-level page components
      services/           ← API service (api.js)
      styles/             ← Global CSS design system
    index.html
    vite.config.js

  server/                 ← Node.js + Express backend (port 3001)
    controllers/          ← AI endpoint logic
    middleware/           ← Multer file upload
    routes/               ← Express route definitions
    services/             ← Grok AI service wrapper
    server.js             ← Entry point

  .env.example            ← Copy to server/.env and add API key
  README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm
- A modern browser (Chrome/Edge recommended for speech features)

### 1. Clone / navigate to the project

```bash
cd accessease
```

### 2. Configure the API key (optional — demo mode works without it)

```bash
cp server/.env.example server/.env
```

Then edit `server/.env`:

```env
XAI_API_KEY=your_actual_xai_api_key_here
XAI_MODEL=grok-2-vision-1212
PORT=3001
```

> **Get your API key:** Visit [console.x.ai](https://console.x.ai) to sign up and generate an API key.

### 3. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Start the servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 5. Open the app

Navigate to **http://localhost:5173**

---

## 🎮 Demo Mode

If `XAI_API_KEY` is not configured, the app automatically enters **Demo Mode**:

- A yellow "Demo Mode Active" banner appears on AI features
- Sample pre-written responses are returned (clearly labelled)
- All UI features, navigation, and accessibility settings work fully
- Speech synthesis and speech recognition still use real browser APIs

**Demo mode is perfect for testing the UI and presenting the design.**

---

## 🗺️ Application Routes

| Route | Page |
|---|---|
| `/` | Landing page (homepage) |
| `/dashboard` | Main accessibility dashboard |
| `/voice-assistant` | Voice-powered AI conversation |
| `/text-to-speech` | Listen to text read aloud |
| `/speech-to-text` | Transcribe spoken words |
| `/image-description` | AI image analysis |
| `/simplify` | Text simplification (3 levels) |
| `/one-click` | One-Click Accessibility Mode ⭐ |
| `/settings` | Accessibility preferences |

---

## 🌍 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---|---|---|---|---|
| Speech Recognition | ✅ | ✅ | ❌* | ✅ 14.1+ |
| Speech Synthesis (TTS) | ✅ | ✅ | ✅ | ✅ |
| Image Upload | ✅ | ✅ | ✅ | ✅ |
| File Download | ✅ | ✅ | ✅ | ✅ |

*Firefox users see a manual text-entry fallback for speech-to-text and voice assistant.

**Recommended browser for best experience: Google Chrome or Microsoft Edge.**

---

## 🔐 Privacy & Security

- API keys are stored server-side only — never exposed to the browser
- Uploaded images are held in memory only and never saved to disk
- Microphone access requires explicit user permission
- No user data is stored or logged beyond the current session
- Rate limiting applied on all AI endpoints (100 req / 15 min)

---

## 📋 Hackathon Demonstration Flow

1. **Open** `http://localhost:5173` — show the landing page
2. **Click** "Try AccessEase AI" → Dashboard
3. **Text to Speech** — paste any text, click Read Aloud
4. **Speech to Text** — click microphone, speak, see live transcript
5. **Simplify Text** — paste complex paragraph, choose level, click Simplify
6. **Image Description** — upload any photo, click Analyze
7. **One-Click Mode** ⭐ — upload a document/sign image → full AI pipeline
8. **Settings** — demo font size, high contrast, dyslexia font

---

## 🛠️ API Endpoints

```
GET  /api/health                     — Server status & API configuration check
POST /api/ai/chat                    — Voice assistant conversation
POST /api/ai/simplify                — Text simplification
POST /api/ai/describe-image          — Image description (multipart/form-data)
POST /api/ai/accessibility-workflow  — One-Click Mode pipeline
```

---

## 📄 License

Built for educational and hackathon purposes. Not for commercial distribution.
