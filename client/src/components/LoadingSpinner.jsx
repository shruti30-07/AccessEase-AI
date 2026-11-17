import React from 'react';

export default function LoadingSpinner({ size = 'md', text, fullPage }) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';
  if (fullPage) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }} role="status" aria-label={text || 'Loading'}>
        <div className={`spinner ${sizeClass}`} />
        {text && <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>{text}</p>}
      </div>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} role="status" aria-label={text || 'Loading'}>
      <span className={`spinner ${sizeClass}`} />
      {text && <span style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>{text}</span>}
    </span>
  );
}
