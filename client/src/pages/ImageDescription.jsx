import React, { useState, useRef, useCallback } from 'react';
import { Image, Upload, Zap, Volume2, Square, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { describeImage, getErrorMessage } from '../services/api.js';
import { useTextToSpeech } from '../hooks/useTextToSpeech.js';
import DemoNotice from '../components/DemoNotice.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

export default function ImageDescription() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTextToSpeech(1.0);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError(null);
    setDescription(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await describeImage(file);
      setDescription(data);
      setIsDemo(data.isDemo || false);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setDescription(null);
    setError(null);
    setIsDemo(false);
    stop();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fullDescription = description ? `${description.short} ${description.detailed}` : '';

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon feature-icon-cyan"><Image size={24} aria-hidden="true" /></div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>AI Image Description</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--font-size-sm)' }}>Upload any image to get a detailed AI-generated description.</p>
      </div>

      <div className="page-content">
        <DemoNotice isDemo={isDemo} />

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Upload Section */}
          <div>
            {!preview ? (
              <div
                className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload an image. Click or drag and drop a JPG, PNG, or WEBP file."
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  onChange={e => handleFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  aria-hidden="true"
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(131,217,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={32} color="var(--color-cyan-dark)" aria-hidden="true" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>Drop your image here</p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', margin: '0 0 0.5rem' }}>or click to browse</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', margin: 0 }}>JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card card-elevated" style={{ padding: 0, overflow: 'hidden' }}>
                <img
                  src={preview}
                  alt="Uploaded image preview"
                  style={{ width: '100%', maxHeight: 320, objectFit: 'contain', background: '#000', display: 'block' }}
                />
                <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary flex-1"
                    onClick={handleAnalyze}
                    disabled={loading}
                    aria-label="Analyze this image with AI"
                  >
                    {loading ? <LoadingSpinner size="sm" text="Analyzing..." /> : <><Zap size={16} aria-hidden="true" /> Analyze Image</>}
                  </button>
                  <button className="btn btn-ghost" onClick={handleReset} aria-label="Upload a different image">
                    <RotateCcw size={16} aria-hidden="true" /> New Image
                  </button>
                </div>
              </div>
            )}

            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
              <div style={{ fontSize: 'var(--font-size-xs)' }}>
                AI descriptions may not be fully accurate. This tool is intended to assist, not replace professional accessibility services.
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {!description && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, background: 'var(--color-white)', borderRadius: 20, border: '1px solid var(--color-border-light)', textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>
                <Image size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} aria-hidden="true" />
                <p style={{ margin: 0 }}>Upload and analyze an image to see the AI description here.</p>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, background: 'var(--color-white)', borderRadius: 20, border: '1px solid var(--color-border-light)', gap: '1rem' }}>
                <div className="spinner spinner-lg" />
                <p style={{ color: 'var(--color-muted)', margin: 0 }}>AI is analyzing your image...</p>
              </div>
            )}

            {description && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Short Description */}
                <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-cyan">Summary</span>
                  </div>
                  <p style={{ lineHeight: 1.7, color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                    {description.short}
                  </p>
                </div>

                {/* Detailed Description */}
                <div className="card card-elevated" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-violet">Detailed Description</span>
                    {ttsSupported && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => isSpeaking ? stop() : speak(fullDescription)}
                        aria-label={isSpeaking ? 'Stop reading aloud' : 'Read description aloud'}
                      >
                        {isSpeaking ? <><Square size={12} aria-hidden="true" /> Stop</> : <><Volume2 size={12} aria-hidden="true" /> Read Aloud</>}
                      </button>
                    )}
                  </div>
                  <p style={{ lineHeight: 1.75, color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {description.detailed}
                  </p>
                </div>

                {isDemo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
                    <Check size={12} aria-hidden="true" />
                    Sample description shown. Configure xAI API key for real analysis.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
