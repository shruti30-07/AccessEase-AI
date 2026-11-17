import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

// Pages
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import VoiceAssistant from './pages/VoiceAssistant.jsx';
import TextToSpeech from './pages/TextToSpeech.jsx';
import SpeechToText from './pages/SpeechToText.jsx';
import ImageDescription from './pages/ImageDescription.jsx';
import SimplifyText from './pages/SimplifyText.jsx';
import OneClickMode from './pages/OneClickMode.jsx';
import Settings from './pages/Settings.jsx';

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page — full width, no sidebar */}
          <Route path="/" element={<Home />} />

          {/* App routes — with sidebar layout */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/voice-assistant" element={<AppLayout><VoiceAssistant /></AppLayout>} />
          <Route path="/text-to-speech" element={<AppLayout><TextToSpeech /></AppLayout>} />
          <Route path="/speech-to-text" element={<AppLayout><SpeechToText /></AppLayout>} />
          <Route path="/image-description" element={<AppLayout><ImageDescription /></AppLayout>} />
          <Route path="/simplify" element={<AppLayout><SimplifyText /></AppLayout>} />
          <Route path="/one-click" element={<AppLayout><OneClickMode /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}
