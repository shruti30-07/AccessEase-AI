import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Accessibility, Settings } from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  return (
    <header style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem', position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)', height: '64px' }}>
      <button
        onClick={onMenuToggle}
        className="btn btn-icon btn-ghost"
        aria-label="Toggle navigation menu"
        style={{ flexShrink: 0 }}
      >
        <Menu size={22} aria-hidden="true" />
      </button>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <div style={{ width: 28, height: 28, borderRadius: '7px', background: 'linear-gradient(135deg, #7357D9, #83D9E8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Accessibility size={16} color="white" aria-hidden="true" />
        </div>
        <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>AccessEase AI</span>
      </Link>
      <div style={{ marginLeft: 'auto' }}>
        <Link to="/settings" className="btn btn-sm btn-ghost" aria-label="Accessibility settings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Settings size={16} aria-hidden="true" /> Settings
        </Link>
      </div>
    </header>
  );
}
