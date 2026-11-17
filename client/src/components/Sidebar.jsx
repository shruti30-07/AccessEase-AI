import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Mic, Volume2, FileText, Image, Zap, Settings, Accessibility
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Voice Assistant', icon: Mic, to: '/voice-assistant' },
  { label: 'Text to Speech', icon: Volume2, to: '/text-to-speech' },
  { label: 'Speech to Text', icon: FileText, to: '/speech-to-text' },
  { label: 'Image Description', icon: Image, to: '/image-description' },
  { label: 'Simplify Text', icon: Zap, to: '/simplify' },
  { label: 'One-Click Mode', icon: Accessibility, to: '/one-click', badge: 'New' },
  { label: 'Settings', icon: Settings, to: '/settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <nav
        className={`app-sidebar${isOpen ? ' open' : ''}`}
        aria-label="Primary"
      >
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #7357D9, #83D9E8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Accessibility size={20} color="white" aria-hidden="true" />
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>AccessEase</span>
          </Link>
        </div>
        <ul style={{ listStyle: 'none', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV_ITEMS.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.625rem',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                  background: isActive ? 'linear-gradient(135deg, rgba(115,87,217,0.6), rgba(115,87,217,0.3))' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s',
                })}
              >
                <item.icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: 'linear-gradient(135deg, #7357D9, #83D9E8)', borderRadius: '999px', color: 'white', fontWeight: 700 }}>{item.badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textAlign: 'center' }}>Technology without barriers</p>
        </div>
      </nav>
    </>
  );
}
