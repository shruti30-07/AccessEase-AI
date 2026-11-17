import React from 'react';

export default function WaveformAnimation({ active, bars = 7 }) {
  return (
    <div className="waveform" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '32px' }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '4px',
            height: active ? undefined : '8px',
            borderRadius: '999px',
            background: active ? 'var(--color-violet)' : 'var(--color-border)',
            animation: active ? `wave 1.2s ease-in-out ${i * 0.1}s infinite` : 'none',
          }}
        />
      ))}
    </div>
  );
}
