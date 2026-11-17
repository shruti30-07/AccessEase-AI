import React, { useState } from 'react';
import { Volume2, Play, Pause, Square, ChevronDown } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech.js';

const SAMPLE_TEXT = `Accessibility means giving people equal access to information and interactions. It is about removing barriers so that everyone, regardless of ability, can participate fully in digital life. When we design with accessibility in mind, we create better experiences for everyone — including people with temporary disabilities, older users, and anyone using technology in challenging environments.`;

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1.0);
  const { isSupported, isSpeaking, isPaused, voices, selectedVoice, setSelectedVoice, speak, pause, resume, stop } = useTextToSpeech(rate);

  if (!isSupported) {
    return (
      <div>
        <div className="page-header">
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Text to Speech</h1>
        </div>
        <div className="page-content">
          <div className="alert alert-warning" role="alert">
            <strong>Not Available</strong> — Your browser does not support the Speech Synthesis API. Please try Chrome, Edge, or Safari.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon feature-icon-cyan"><Volume2 size={24} aria-hidden="true" /></div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>Text to Speech</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--font-size-sm)' }}>Enter or paste any text and listen to it read aloud.</p>
      </div>

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Input Panel */}
        <div>
          <div className="card card-elevated" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label htmlFor="tts-input" className="form-label">Text to Read</label>
              <button className="btn btn-ghost btn-sm" onClick={() => setText(SAMPLE_TEXT)} aria-label="Load sample text">Sample Text</button>
            </div>
            <textarea
              id="tts-input"
              className="form-textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              style={{ minHeight: 240 }}
              aria-describedby="char-count"
            />
            <p id="char-count" style={{ textAlign: 'right', fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', marginTop: '0.5rem' }}>{text.length} characters</p>
          </div>

          {/* Voice Controls */}
          <div className="card card-elevated" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1rem' }}>Voice Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="voice-select" className="form-label">Voice</label>
                <select
                  id="voice-select"
                  className="form-select"
                  value={selectedVoice?.name || ''}
                  onChange={e => { const v = voices.find(v => v.name === e.target.value); setSelectedVoice(v); }}
                >
                  {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="speed-range" className="form-label">Speed: {rate.toFixed(1)}x</label>
                <input
                  id="speed-range"
                  type="range"
                  min="0.5" max="2" step="0.1"
                  value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-violet)' }}
                  aria-label={`Speech speed: ${rate.toFixed(1)} times`}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
                  <span>0.5x (Slow)</span><span>1.0x (Normal)</span><span>2.0x (Fast)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playback Panel */}
        <div>
          <div className="card card-elevated" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: isSpeaking ? 'linear-gradient(135deg, #7357D9, #83D9E8)' : 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSpeaking ? '0 0 0 12px rgba(115,87,217,0.15), 0 0 0 24px rgba(115,87,217,0.07)' : 'none', transition: 'all 0.4s ease' }}>
              <Volume2 size={42} color={isSpeaking ? 'white' : 'var(--color-muted)'} aria-hidden="true" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                {isSpeaking && !isPaused ? 'Playing...' : isPaused ? 'Paused' : 'Ready to play'}
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', margin: 0 }}>{text.length > 0 ? `${text.length} characters` : 'No text entered'}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {!isSpeaking || isPaused ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => { if (isPaused) resume(); else speak(text, rate); }}
                  disabled={!text.trim()}
                  aria-label={isPaused ? 'Resume reading' : 'Start reading aloud'}
                >
                  <Play size={20} aria-hidden="true" /> {isPaused ? 'Resume' : 'Read Aloud'}
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg" onClick={pause} aria-label="Pause reading">
                  <Pause size={20} aria-hidden="true" /> Pause
                </button>
              )}
              {isSpeaking && (
                <button className="btn btn-ghost btn-lg" onClick={stop} aria-label="Stop reading">
                  <Square size={20} aria-hidden="true" /> Stop
                </button>
              )}
            </div>
            {!text.trim() && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', textAlign: 'center', margin: 0 }}>Enter some text on the left to get started, or click "Sample Text".</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
