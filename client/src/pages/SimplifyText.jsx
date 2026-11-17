import React, { useState } from 'react';
import { Zap, Copy, Volume2, Square, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { simplifyText, getErrorMessage } from '../services/api.js';
import { useTextToSpeech } from '../hooks/useTextToSpeech.js';
import DemoNotice from '../components/DemoNotice.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const SAMPLE_TEXT = `The mitochondrion (plural: mitochondria) is a double membrane-bound organelle found in the cytoplasm of eukaryotic cells. Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. In addition to supplying cellular energy, mitochondria are involved in other tasks, such as signaling, cellular differentiation, and cell death, as well as maintaining control of the cell cycle and cell growth.`;

const LEVELS = [
  { value: 'simple', label: 'Simple', desc: 'Easier words, same detail' },
  { value: 'very-simple', label: 'Very Simple', desc: 'Short sentences, common words' },
  { value: 'step-by-step', label: 'Step-by-Step', desc: 'Numbered list format' },
];

const LANGUAGES = [
  { value: 'english', label: '🇬🇧 English' },
  { value: 'hindi', label: '🇮🇳 Hindi' },
];

const SENSITIVE_KEYWORDS = ['mg', 'dosage', 'treatment', 'diagnosis', 'legal', 'contract', 'liability', 'tax', 'investment', 'stock'];

function needsDisclaimer(text) {
  const lower = text.toLowerCase();
  return SENSITIVE_KEYWORDS.some(k => lower.includes(k));
}

export default function SimplifyText() {
  const [inputText, setInputText] = useState('');
  const [level, setLevel] = useState('simple');
  const [language, setLanguage] = useState('english');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTextToSpeech(1.0);

  const handleSimplify = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await simplifyText(inputText.trim(), level, language);
      setResult(data.result);
      setIsDemo(data.isDemo || false);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy to clipboard.');
    }
  };

  const showDisclaimer = inputText && needsDisclaimer(inputText);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon feature-icon-violet"><Zap size={24} aria-hidden="true" /></div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>Simplify Information</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--font-size-sm)' }}>Make complex text easy to understand with AI-powered simplification.</p>
      </div>

      <div className="page-content">
        <DemoNotice isDemo={isDemo} />

        {showDisclaimer && (
          <div className="alert alert-warning" role="note" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div>
              <strong>Important notice:</strong> This text may contain medical, legal, or financial information.
              AI simplification does not replace professional advice. Always consult a qualified professional for important decisions.
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
          {/* Input Panel */}
          <div>
            <div className="card card-elevated" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label htmlFor="simplify-input" className="form-label">Text to Simplify</label>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setInputText(SAMPLE_TEXT)}
                  aria-label="Load sample complex text"
                >
                  Sample Text
                </button>
              </div>
              <textarea
                id="simplify-input"
                className="form-textarea"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Paste complex text here to simplify it..."
                style={{ minHeight: 180 }}
                aria-describedby="char-count-simplify"
              />
              <p id="char-count-simplify" style={{ textAlign: 'right', fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                {inputText.length} / 5000 characters
              </p>
            </div>

            {/* Controls */}
            <div className="card card-elevated" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1rem' }}>Simplification Options</h2>

              <fieldset style={{ border: 'none', padding: 0, marginBottom: '1rem' }}>
                <legend className="form-label" style={{ marginBottom: '0.75rem' }}>Simplification Level</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} role="radiogroup" aria-label="Simplification level">
                  {LEVELS.map(l => (
                    <label key={l.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 10, border: `2px solid ${level === l.value ? 'var(--color-violet)' : 'var(--color-border-light)'}`, background: level === l.value ? 'rgba(115,87,217,0.05)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <input
                        type="radio"
                        name="level"
                        value={l.value}
                        checked={level === l.value}
                        onChange={() => setLevel(l.value)}
                        style={{ accentColor: 'var(--color-violet)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: level === l.value ? 'var(--color-violet)' : 'var(--color-text)' }}>{l.label}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>{l.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="form-group">
                <label htmlFor="language-select" className="form-label">Output Language</label>
                <select
                  id="language-select"
                  className="form-select"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleSimplify}
              disabled={!inputText.trim() || loading}
              style={{ width: '100%' }}
              aria-label="Simplify the entered text"
            >
              {loading ? <LoadingSpinner size="sm" text="Simplifying..." /> : <><Zap size={18} aria-hidden="true" /> Simplify Text</>}
            </button>
          </div>

          {/* Result Panel */}
          <div>
            {!result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, background: 'var(--color-white)', borderRadius: 20, border: '1px solid var(--color-border-light)', textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>
                <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} aria-hidden="true" />
                <p style={{ margin: 0 }}>Your simplified text will appear here.</p>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, background: 'var(--color-white)', borderRadius: 20, border: '1px solid var(--color-border-light)', gap: '1rem' }}>
                <div className="spinner spinner-lg" />
                <p style={{ color: 'var(--color-muted)', margin: 0 }}>AI is simplifying your text...</p>
              </div>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Original */}
                <div className="card card-elevated" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-warning">Original</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, maxHeight: 120, overflowY: 'auto' }}>
                    {inputText}
                  </p>
                </div>

                {/* Simplified Result */}
                <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-success">Simplified ({LEVELS.find(l => l.value === level)?.label})</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {ttsSupported && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => isSpeaking ? stop() : speak(result)}
                          aria-label={isSpeaking ? 'Stop reading aloud' : 'Read result aloud'}
                        >
                          {isSpeaking ? <><Square size={12} aria-hidden="true" /> Stop</> : <><Volume2 size={12} aria-hidden="true" /> Read Aloud</>}
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={handleCopy}
                        aria-label="Copy simplified text"
                      >
                        {copied ? <><Check size={12} aria-hidden="true" /> Copied!</> : <><Copy size={12} aria-hidden="true" /> Copy</>}
                      </button>
                    </div>
                  </div>
                  <div style={{ lineHeight: 1.8, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                    {result}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
