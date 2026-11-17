import React, { useState } from 'react';
import { FileText, Mic, MicOff, Copy, Download, Trash2, Check, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';

export default function SpeechToText() {
  const { isSupported, isListening, transcript, interimTranscript, error, startListening, stopListening, clearTranscript, setTranscript } = useSpeechRecognition();
  const [copied, setCopied] = useState(false);
  const [manualText, setManualText] = useState('');
  const displayText = transcript + (interimTranscript ? interimTranscript : '');
  const finalText = isSupported ? displayText : manualText;

  const handleCopy = async () => {
    if (!finalText.trim()) return;
    try { await navigator.clipboard.writeText(finalText.trim()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { alert('Could not copy to clipboard.'); }
  };

  const handleDownload = () => {
    if (!finalText.trim()) return;
    const blob = new Blob([finalText.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transcript.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon feature-icon-violet"><FileText size={24} aria-hidden="true" /></div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>Speech to Text</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--font-size-sm)' }}>Convert your spoken words into written text.</p>
      </div>
      <div className="page-content">
        {!isSupported && (
          <div className="alert alert-warning" role="alert" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div>
              <strong>Speech recognition is not available in your browser.</strong> Please use Chrome, Edge, or Safari 14.1+. You can still type in the text area below.
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Controls */}
          <div>
            <div className="card card-elevated" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 1.5rem' }}>
                <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', background: isListening ? 'linear-gradient(135deg, #E53E3E, #C53030)' : 'linear-gradient(135deg, #7357D9, #5A42C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isListening ? '0 0 0 12px rgba(229,62,62,0.15), 0 0 0 24px rgba(229,62,62,0.07)' : 'none', transition: 'all 0.3s', cursor: isSupported ? 'pointer' : 'not-allowed' }}
                  onClick={isSupported ? (isListening ? stopListening : startListening) : undefined}
                  role={isSupported ? 'button' : undefined}
                  aria-label={isListening ? 'Stop recording' : 'Start recording'}
                  aria-pressed={isListening}
                  tabIndex={isSupported ? 0 : -1}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isSupported && (isListening ? stopListening() : startListening()); } }}
                >
                  {isListening ? <MicOff size={40} color="white" aria-hidden="true" /> : <Mic size={40} color="white" aria-hidden="true" />}
                </div>
              </div>
              <p style={{ fontWeight: 600, color: isListening ? '#E53E3E' : 'var(--color-text)', marginBottom: '0.5rem' }}>
                {!isSupported ? 'Not Supported' : isListening ? '🔴 Recording...' : 'Click to Record'}
              </p>
              {isListening && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', margin: 0 }}>Speak clearly into your microphone</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {isSupported && (
                <button className={`btn ${isListening ? 'btn-danger' : 'btn-primary'} flex-1`} onClick={isListening ? stopListening : startListening} aria-label={isListening ? 'Stop recording' : 'Start recording'}>
                  {isListening ? <><MicOff size={16} aria-hidden="true" /> Stop</> : <><Mic size={16} aria-hidden="true" /> Start Recording</>}
                </button>
              )}
              <button className="btn btn-ghost flex-1" onClick={() => { clearTranscript(); setManualText(''); }} aria-label="Clear transcript">
                <Trash2 size={16} aria-hidden="true" /> Clear
              </button>
            </div>
          </div>

          {/* Transcript */}
          <div>
            <div className="card card-elevated" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>Transcript</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={handleCopy} disabled={!finalText.trim()} aria-label="Copy transcript">
                    {copied ? <><Check size={14} aria-hidden="true" /> Copied!</> : <><Copy size={14} aria-hidden="true" /> Copy</>}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={handleDownload} disabled={!finalText.trim()} aria-label="Download transcript as text file">
                    <Download size={14} aria-hidden="true" /> Download
                  </button>
                </div>
              </div>
              {isSupported ? (
                <div className="transcript-area" aria-live="polite" aria-label="Speech transcript">
                  {transcript && <span>{transcript}</span>}
                  {interimTranscript && <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>{interimTranscript}</span>}
                  {!transcript && !interimTranscript && <span style={{ color: 'var(--color-muted)' }}>Your speech will appear here as you speak...</span>}
                </div>
              ) : (
                <textarea
                  className="form-textarea"
                  value={manualText}
                  onChange={e => setManualText(e.target.value)}
                  placeholder="Speech recognition is not supported. Type your text here instead..."
                  aria-label="Manual text entry fallback"
                  style={{ minHeight: 200 }}
                />
              )}
              {finalText && <p style={{ marginTop: '0.75rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{finalText.trim().split(/\s+/).filter(Boolean).length} words</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
