import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Volume2, FileText, Image, Zap, Accessibility, Clock, ArrowRight, Sparkles } from 'lucide-react';
import FeatureCard from '../components/FeatureCard.jsx';
import { checkHealth } from '../services/api.js';

const FEATURES = [
  { icon: Mic, title: 'Voice Assistant', description: 'Ask questions and get AI responses using your voice.', to: '/voice-assistant', color: 'violet' },
  { icon: Volume2, title: 'Text to Speech', description: 'Listen to any text read aloud with adjustable speed.', to: '/text-to-speech', color: 'cyan' },
  { icon: FileText, title: 'Speech to Text', description: 'Convert spoken words into editable text instantly.', to: '/speech-to-text', color: 'violet' },
  { icon: Image, title: 'Image Description', description: 'Get AI descriptions of any image you upload.', to: '/image-description', color: 'cyan' },
  { icon: Zap, title: 'Simplify Text', description: 'Make complex information easy to understand.', to: '/simplify', color: 'violet' },
  { icon: Accessibility, title: 'One-Click Mode', description: 'Upload an image — get description, text, and audio in one flow.', to: '/one-click', color: 'navy', badge: 'Signature' },
];

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState(null);
  useEffect(() => {
    checkHealth().then(setApiStatus).catch(() => setApiStatus({ status: 'error', apiConfigured: false }));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.25rem' }}>{greeting} 👋</h1>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Welcome to AccessEase AI — your inclusive accessibility companion.</p>
          </div>
          {apiStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 999, background: apiStatus.apiConfigured ? 'rgba(56,178,172,0.1)' : 'rgba(236,201,75,0.1)', border: `1px solid ${apiStatus.apiConfigured ? 'rgba(56,178,172,0.3)' : 'rgba(236,201,75,0.3)'}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: apiStatus.apiConfigured ? '#38B2AC' : '#ECC94B' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: apiStatus.apiConfigured ? '#1D4044' : '#744210' }}>
                {apiStatus.apiConfigured ? 'AI Connected' : 'Demo Mode'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="page-content">
        {/* One-Click Mode Highlight */}
        <div style={{ background: 'linear-gradient(135deg, #17243A, #2D1B69)', borderRadius: 20, padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(115,87,217,0.25) 0%, transparent 70%)' }} aria-hidden="true" />
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #7357D9, #83D9E8)', color: 'white', padding: '0.2rem 0.75rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <Sparkles size={12} aria-hidden="true" /> Signature Feature
            </div>
            <h2 style={{ color: 'white', fontSize: 'var(--font-size-xl)', marginBottom: '0.5rem' }}>One-Click Accessibility Mode</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--font-size-sm)', margin: 0, maxWidth: 500 }}>Upload any image to get AI image description, text extraction, simplified content, and audio — all in one seamless workflow.</p>
          </div>
          <Link to="/one-click" className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #7357D9, #5A42C0)', color: 'white', flexShrink: 0, boxShadow: '0 8px 24px rgba(115,87,217,0.4)' }}>
            Try It Now <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {/* Feature Cards */}
        <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} aria-hidden="true" /> All Accessibility Tools
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {FEATURES.map(f => <FeatureCard key={f.to} {...f} />)}
        </div>

        {/* Quick Tips */}
        <div style={{ marginTop: '2.5rem', background: 'var(--color-white)', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--color-border-light)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1rem' }}>Quick Tips</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: Mic, tip: 'Use Chrome or Edge for best speech recognition results.' },
              { icon: Volume2, tip: 'Adjust TTS speed in Settings for a comfortable listening pace.' },
              { icon: Accessibility, tip: 'Enable high contrast mode in Settings for better visibility.' },
            ].map(({ icon: Icon, tip }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem', background: 'var(--color-bg)', borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(115,87,217,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="var(--color-violet)" aria-hidden="true" />
                </div>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
