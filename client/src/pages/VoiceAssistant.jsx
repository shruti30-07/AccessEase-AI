import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Square, Trash2, Send, AlertCircle, Bot, User } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';
import { useTextToSpeech } from '../hooks/useTextToSpeech.js';
import { sendChatMessage, getErrorMessage } from '../services/api.js';
import DemoNotice from '../components/DemoNotice.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import WaveformAnimation from '../components/WaveformAnimation.jsx';

export default function VoiceAssistant() {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { isSupported: speechSupported, isListening, transcript, interimTranscript, error: speechError, startListening, stopListening, clearTranscript, setTranscript } = useSpeechRecognition();
  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTextToSpeech(1.0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript && !isListening) {
      handleSendMessage(transcript.trim());
      setTranscript('');
    }
  }, [isListening]);

  const handleSendMessage = async (text) => {
    const msg = text || textInput.trim();
    if (!msg) return;
    setTextInput('');
    setError(null);
    clearTranscript();

    const userMessage = { role: 'user', content: msg, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const data = await sendChatMessage(msg, history);
      const assistantMessage = { role: 'assistant', content: data.response, id: Date.now() + 1 };
      setMessages(prev => [...prev, assistantMessage]);
      setIsDemo(data.isDemo || false);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) { stopListening(); } else { startListening(); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const lastAIMessage = [...messages].reverse().find(m => m.role === 'assistant');

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon feature-icon-violet"><Mic size={24} aria-hidden="true" /></div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>Voice Assistant</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--font-size-sm)' }}>Speak or type to interact with your AI accessibility companion.</p>
      </div>

      <div className="page-content">
        <DemoNotice isDemo={isDemo} />

        {(speechError || error) && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>{speechError || error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Mic Section */}
          <div>
            <div className="card card-elevated" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1.5rem' }}>Voice Input</h2>
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isListening && (
                  <>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(115,87,217,0.15)', animation: 'pulse-ring 1.5s ease-out infinite' }} aria-hidden="true" />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(115,87,217,0.1)', animation: 'pulse-ring 1.5s ease-out 0.5s infinite' }} aria-hidden="true" />
                  </>
                )}
                <button
                  onClick={handleMicClick}
                  disabled={!speechSupported}
                  style={{ width: 100, height: 100, borderRadius: '50%', border: 'none', cursor: speechSupported ? 'pointer' : 'not-allowed', background: isListening ? 'linear-gradient(135deg, #E53E3E, #C53030)' : 'linear-gradient(135deg, #7357D9, #5A42C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isListening ? '0 8px 32px rgba(229,62,62,0.4)' : '0 8px 32px rgba(115,87,217,0.4)', transition: 'all 0.3s', position: 'relative', zIndex: 1 }}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  aria-pressed={isListening}
                >
                  {isListening ? <MicOff size={38} color="white" aria-hidden="true" /> : <Mic size={38} color="white" aria-hidden="true" />}
                </button>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <WaveformAnimation active={isListening} bars={7} />
              </div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: isListening ? '#E53E3E' : 'var(--color-text)' }} aria-live="polite">
                {!speechSupported ? 'Voice not supported' : isListening ? 'Listening...' : 'Tap to speak'}
              </p>
              {!speechSupported && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', margin: 0 }}>Use the text input below instead.</p>}
              {(transcript || interimTranscript) && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 10, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textAlign: 'left', fontStyle: 'italic' }}>
                  {transcript}{interimTranscript && <span style={{ color: 'var(--color-muted)' }}>{interimTranscript}</span>}
                </div>
              )}
            </div>
            {/* Text Input Fallback */}
            <div className="card card-elevated" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>Or type your message</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={inputRef}
                  type="text"
                  className="form-input"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question..."
                  aria-label="Type a message to send to the voice assistant"
                  disabled={loading}
                />
                <button className="btn btn-primary btn-icon" onClick={() => handleSendMessage()} disabled={!textInput.trim() || loading} aria-label="Send message">
                  <Send size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div>
            <div className="card card-elevated" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: 400 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>Conversation</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {lastAIMessage && ttsSupported && (
                    <button className="btn btn-ghost btn-sm" onClick={() => isSpeaking ? stop() : speak(lastAIMessage.content)} aria-label={isSpeaking ? 'Stop speaking' : 'Read last response aloud'}>
                      {isSpeaking ? <><Square size={12} aria-hidden="true" /> Stop</> : <><Volume2 size={12} aria-hidden="true" /> Speak</>}
                    </button>
                  )}
                  {messages.length > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setMessages([])} aria-label="Clear conversation">
                      <Trash2 size={14} aria-hidden="true" /> Clear
                    </button>
                  )}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }} role="log" aria-label="Conversation history" aria-live="polite">
                {messages.length === 0 && !loading && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', textAlign: 'center', padding: '2rem' }}>
                    <Mic size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} aria-hidden="true" />
                    <p style={{ margin: 0 }}>Speak or type to start a conversation</p>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.role === 'user' ? 'var(--color-violet)' : 'linear-gradient(135deg, #17243A, #2D1B69)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {msg.role === 'user' ? <User size={16} color="white" aria-hidden="true" /> : <Bot size={16} color="#83D9E8" aria-hidden="true" />}
                    </div>
                    <div style={{ maxWidth: '78%', padding: '0.75rem 1rem', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: msg.role === 'user' ? 'var(--color-violet)' : 'var(--color-bg)', border: msg.role !== 'user' ? '1px solid var(--color-border-light)' : 'none', color: msg.role === 'user' ? 'white' : 'var(--color-text)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #17243A, #2D1B69)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={16} color="#83D9E8" aria-hidden="true" />
                    </div>
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '4px 16px 16px 16px', background: 'var(--color-bg)', border: '1px solid var(--color-border-light)' }}>
                      <LoadingSpinner size="sm" text="Thinking..." />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
