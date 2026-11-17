import React, { useState, useRef, useCallback } from 'react';
import {
  Accessibility, Upload, Image, FileText, Zap, Volume2, Square,
  Mic, MicOff, MessageSquare, AlertCircle, Check, RotateCcw, ChevronRight,
  Loader, CheckCircle2
} from 'lucide-react';
import { runAccessibilityWorkflow, sendChatMessage, getErrorMessage } from '../services/api.js';
import { useTextToSpeech } from '../hooks/useTextToSpeech.js';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';
import DemoNotice from '../components/DemoNotice.jsx';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

const STEPS = [
  { id: 'upload', label: 'Upload Image', icon: Upload },
  { id: 'describe', label: 'AI Description', icon: Image },
  { id: 'extract', label: 'Text & Summary', icon: FileText },
  { id: 'simplify', label: 'Key Information', icon: Zap },
  { id: 'interact', label: 'Ask Questions', icon: Mic },
];

export default function OneClickMode() {
  const [phase, setPhase] = useState('upload'); // upload | processing | results
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTextToSpeech(1.0);
  const { isSupported: speechSupported, isListening, transcript, startListening, stopListening, clearTranscript, setTranscript } = useSpeechRecognition();

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) { setError('Invalid file type. Please upload JPG, PNG, or WEBP.'); return; }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) { setError(`File too large. Maximum ${MAX_SIZE_MB}MB.`); return; }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleRunWorkflow = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setPhase('processing');
    setCurrentStep(0);

    // Simulate step progress
    const stepTimers = STEPS.slice(1, -1).map((_, i) =>
      setTimeout(() => setCurrentStep(i + 1), (i + 1) * 1200)
    );

    try {
      const data = await runAccessibilityWorkflow(file);
      stepTimers.forEach(clearTimeout);
      setCurrentStep(STEPS.length - 1);
      setResults(data);
      setIsDemo(data.isDemo || false);

      // Add context to chat
      const ctx = `I uploaded an image. Here's what the AI found:\n\nDescription: ${data.imageDescription}\n\nVisible text: ${data.visibleText}\n\nSummary: ${data.simplifiedSummary}`;
      setChatMessages([{ role: 'system-context', content: ctx, id: Date.now() }]);
      setPhase('results');
    } catch (e) {
      stepTimers.forEach(clearTimeout);
      setError(getErrorMessage(e));
      setPhase('upload');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhase('upload');
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    setIsDemo(false);
    setCurrentStep(0);
    setChatMessages([]);
    setChatInput('');
    stop();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChatSend = async (text) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    setChatInput('');
    clearTranscript();
    const userMsg = { role: 'user', content: msg, id: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);
    try {
      const history = chatMessages
        .filter(m => m.role !== 'system-context')
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));
      const context = results ? `Context from analyzed image: Description: ${results.imageDescription}. Visible text: ${results.visibleText}. Summary: ${results.simplifiedSummary}.` : '';
      const data = await sendChatMessage(msg + (context ? `\n\n[${context}]` : ''), history);
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response, id: Date.now() + 1 }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${getErrorMessage(e)}`, id: Date.now() + 1 }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleMicForChat = () => {
    if (isListening) {
      stopListening();
      if (transcript) handleChatSend(transcript);
    } else {
      startListening();
    }
  };

  const readAllResults = () => {
    if (!results) return;
    const text = `Image Description: ${results.imageDescription}. Visible Text: ${results.visibleText || 'None detected'}. Summary: ${results.simplifiedSummary}. Key information: ${results.keyInformation?.join('. ') || 'None'}`;
    speak(text);
  };

  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {STEPS.map((step, i) => {
        const done = currentStep > i;
        const active = currentStep === i;
        const StepIcon = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: done ? 'var(--color-success)' : active ? 'var(--color-violet)' : 'var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.4s ease',
                boxShadow: active ? '0 0 0 6px rgba(115,87,217,0.2)' : 'none',
              }}>
                {done
                  ? <CheckCircle2 size={18} color="white" aria-hidden="true" />
                  : active && loading
                    ? <Loader size={18} color="white" style={{ animation: 'spin 0.8s linear infinite' }} aria-hidden="true" />
                    : <StepIcon size={18} color={active || done ? 'white' : 'var(--color-muted)'} aria-hidden="true" />
                }
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 500, color: done ? 'var(--color-success)' : active ? 'var(--color-violet)' : 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 32, height: 2, background: i < currentStep ? 'var(--color-success)' : 'var(--color-border)', marginBottom: '1.25rem', transition: 'background 0.4s', flexShrink: 0 }} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(23,36,58,0.1), rgba(45,27,105,0.1))', color: 'var(--color-navy)' }}>
            <Accessibility size={24} aria-hidden="true" />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>One-Click Accessibility Mode</h1>
            <span className="badge badge-violet" style={{ marginTop: '0.25rem' }}>Signature Feature</span>
          </div>
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: 'var(--font-size-sm)' }}>
          Upload any image to get AI description, text extraction, simplified summary, and an interactive Q&amp;A — all in one seamless workflow.
        </p>
      </div>

      <div className="page-content">
        <DemoNotice isDemo={isDemo} />

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Indicator */}
        <div className="card card-elevated" style={{ padding: '1.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          <StepIndicator />
          {phase === 'processing' && (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }} aria-live="polite">
              AI is analyzing your image... Please wait.
            </p>
          )}
        </div>

        {/* UPLOAD PHASE */}
        {phase === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              {!preview ? (
                <div
                  className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload an image. Click or drag and drop."
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
                >
                  <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} aria-hidden="true" />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(115,87,217,0.15), rgba(131,217,232,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={32} color="var(--color-violet)" aria-hidden="true" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem', fontSize: 'var(--font-size-lg)' }}>Drop your image here</p>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', margin: '0 0 0.5rem' }}>or click to browse</p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', margin: 0 }}>JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card card-elevated" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={preview} alt="Uploaded image preview" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', background: '#000', display: 'block' }} />
                  <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary flex-1 btn-lg"
                      onClick={handleRunWorkflow}
                      disabled={loading}
                      aria-label="Start One-Click Accessibility analysis"
                    >
                      <Accessibility size={18} aria-hidden="true" /> Run Full Accessibility Analysis
                    </button>
                    <button className="btn btn-ghost" onClick={handleReset} aria-label="Upload a different image">
                      <RotateCcw size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card card-elevated" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1rem' }}>What happens in One-Click Mode?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: Image, label: 'AI Image Description', desc: 'Detailed visual description of your image' },
                  { icon: FileText, label: 'Text Extraction', desc: 'Any visible text in the image is identified' },
                  { icon: Zap, label: 'Simplified Summary', desc: 'Key information in easy-to-read language' },
                  { icon: Volume2, label: 'Read Aloud', desc: 'All results can be read aloud for you' },
                  { icon: Mic, label: 'Interactive Q&A', desc: 'Ask follow-up questions about the image' },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(115,87,217,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="var(--color-violet)" aria-hidden="true" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING PHASE */}
        {phase === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1.5rem' }}>
            <div className="spinner spinner-lg" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Analyzing your image...</p>
              <p style={{ color: 'var(--color-muted)', margin: 0 }}>{STEPS[Math.min(currentStep, STEPS.length - 1)]?.label}</p>
            </div>
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {ttsSupported && (
                  <button className="btn btn-primary" onClick={() => isSpeaking ? stop() : readAllResults()} aria-label={isSpeaking ? 'Stop reading' : 'Read all results aloud'}>
                    {isSpeaking ? <><Square size={16} aria-hidden="true" /> Stop</> : <><Volume2 size={16} aria-hidden="true" /> Read All Aloud</>}
                  </button>
                )}
              </div>
              <button className="btn btn-ghost" onClick={handleReset} aria-label="Start over with a new image">
                <RotateCcw size={16} aria-hidden="true" /> Start Over
              </button>
            </div>

            {/* Image + Description */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {preview && (
                <div className="card card-elevated" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={preview} alt="Analyzed image" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', background: '#000', display: 'block' }} />
                </div>
              )}
              <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  <Check size={12} aria-hidden="true" /> Image Description
                </span>
                <p style={{ lineHeight: 1.75, color: 'var(--color-text)', margin: 0 }}>{results.imageDescription}</p>
              </div>
            </div>

            {/* Text + Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                <span className="badge badge-violet" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  <FileText size={12} aria-hidden="true" /> Visible Text
                </span>
                <p style={{ lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'pre-wrap', fontSize: 'var(--font-size-sm)' }}>
                  {results.visibleText || 'No readable text detected in this image.'}
                </p>
              </div>
              <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                <span className="badge badge-success" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  <Zap size={12} aria-hidden="true" /> Simplified Summary
                </span>
                <p style={{ lineHeight: 1.75, color: 'var(--color-text)', margin: 0 }}>{results.simplifiedSummary}</p>
              </div>
            </div>

            {/* Key Info */}
            {results.keyInformation?.length > 0 && (
              <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                <span className="badge badge-warning" style={{ marginBottom: '0.875rem', display: 'inline-block' }}>Key Information</span>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {results.keyInformation.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(115,87,217,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-violet)' }}>{i + 1}</div>
                      <span style={{ lineHeight: 1.6, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', paddingTop: '0.2rem' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chat Q&A */}
            <div className="card card-elevated" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} aria-hidden="true" /> Ask Follow-Up Questions
              </h2>
              <div style={{ background: 'var(--color-bg)', borderRadius: 12, padding: '1rem', maxHeight: 240, overflowY: 'auto', marginBottom: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }} role="log" aria-label="Follow-up conversation" aria-live="polite">
                {chatMessages.filter(m => m.role !== 'system-context').length === 0 && !chatLoading && (
                  <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)', margin: 0, textAlign: 'center', padding: '1rem 0' }}>Ask anything about this image...</p>
                )}
                {chatMessages.filter(m => m.role !== 'system-context').map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '0.625rem 0.875rem', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: msg.role === 'user' ? 'var(--color-violet)' : 'var(--color-white)', border: msg.role !== 'user' ? '1px solid var(--color-border-light)' : 'none', color: msg.role === 'user' ? 'white' : 'var(--color-text)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                    {msg.content}
                  </div>
                ))}
                {chatLoading && <div style={{ alignSelf: 'flex-start', padding: '0.625rem 0.875rem', borderRadius: '4px 14px 14px 14px', background: 'var(--color-white)', border: '1px solid var(--color-border-light)' }}><span className="spinner spinner-sm" /></div>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleChatSend(); } }}
                  placeholder="Ask about this image..."
                  aria-label="Ask a follow-up question about the image"
                  disabled={chatLoading}
                />
                {speechSupported && (
                  <button
                    className={`btn btn-icon ${isListening ? 'btn-danger' : 'btn-ghost'}`}
                    onClick={handleMicForChat}
                    aria-label={isListening ? 'Stop voice input' : 'Use voice to ask a question'}
                    aria-pressed={isListening}
                  >
                    {isListening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                  </button>
                )}
                <button
                  className="btn btn-primary btn-icon"
                  onClick={() => handleChatSend()}
                  disabled={!chatInput.trim() || chatLoading}
                  aria-label="Send question"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
