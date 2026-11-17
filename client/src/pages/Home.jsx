import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, Volume2, FileText, Image, Zap, Accessibility,
  ChevronRight, Star, Users, Globe, ArrowRight, CheckCircle, Layers
} from 'lucide-react';

const FEATURES = [
  {
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Interact naturally using your voice. Ask questions, get help, and navigate digitally with just speech.',
    color: '#7357D9',
    to: '/voice-assistant',
  },
  {
    icon: Volume2,
    title: 'Text to Speech',
    description: 'Listen to any text read aloud with adjustable speed and voice options for a comfortable experience.',
    color: '#83D9E8',
    to: '/text-to-speech',
  },
  {
    icon: FileText,
    title: 'Speech to Text',
    description: 'Convert your spoken words into accurate text instantly. Perfect for notes, emails and more.',
    color: '#7357D9',
    to: '/speech-to-text',
  },
  {
    icon: Image,
    title: 'AI Image Description',
    description: 'Upload any image and receive a detailed AI-generated description to understand visual content.',
    color: '#83D9E8',
    to: '/image-description',
  },
  {
    icon: Zap,
    title: 'Simplify Information',
    description: 'Make complex text easy to understand. Choose your simplification level and language.',
    color: '#7357D9',
    to: '/simplify',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose your mode', desc: 'Select how you want to interact — voice, text, or image.' },
  { step: '02', title: 'Input your content', desc: 'Upload, speak, or type the information you need help with.' },
  { step: '03', title: 'AI processes it', desc: 'Our Grok-powered AI understands and analyzes your content.' },
  { step: '04', title: 'Receive accessible results', desc: 'Get clear, easy-to-understand outputs you can read or hear aloud.' },
];

const WHY_ITEMS = [
  { icon: Globe, title: 'Inclusive Technology', desc: 'Built for everyone — visual, hearing, and reading accessibility built-in from the ground up.' },
  { icon: Mic, title: 'Simple Interaction', desc: 'Speak naturally or type. No complicated menus or settings required.' },
  { icon: Layers, title: 'Multiple Modalities', desc: 'Voice, audio, visual, and text — multiple ways to access the same information.' },
  { icon: Star, title: 'AI-Powered', desc: 'Powered by Grok AI for intelligent, context-aware accessibility assistance.' },
];

const DEMO_STATS = [
  { value: '5', label: 'Accessibility tools', note: 'in one platform' },
  { value: '3', label: 'Simplification levels', note: 'for every reader' },
  { value: '2', label: 'Languages supported', note: 'with more planned' },
  { value: '1', label: 'Unified workflow', note: 'One-Click Mode' },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      {/* NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(23,36,58,0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}>
        <nav style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
          height: 72, display: 'flex', alignItems: 'center', gap: '2rem'
        }} aria-label="Primary">
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7357D9, #83D9E8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Accessibility size={20} color="white" aria-hidden="true" />
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>AccessEase AI</span>
          </Link>

          {/* Nav links */}
          <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0, padding: 0 }} role="list">
            {[['#features', 'Features'], ['#how-it-works', 'How It Works'], ['#why', 'Why Us']].map(([href, label]) => (
              <li key={href}>
                <a href={href} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '0.5rem 0.875rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s', display: 'block' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/settings" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 0.875rem', borderRadius: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              Accessibility
            </Link>
            <Link to="/dashboard" style={{
              background: 'linear-gradient(135deg, #7357D9, #5A42C0)',
              color: 'white', textDecoration: 'none', padding: '0.6rem 1.25rem',
              borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
              boxShadow: '0 4px 16px rgba(115,87,217,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(115,87,217,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(115,87,217,0.4)'; }}>
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #17243A 0%, #1a1a2e 40%, #2D1B69 100%)', padding: '7rem 1.5rem 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background accents */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(115,87,217,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} aria-hidden="true" />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(131,217,232,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} aria-hidden="true" />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(115,87,217,0.15)', border: '1px solid rgba(115,87,217,0.3)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <Accessibility size={14} color="#83D9E8" aria-hidden="true" />
            <span style={{ color: '#83D9E8', fontSize: '0.8rem', fontWeight: 600 }}>AI-Powered Accessibility Platform</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Technology should be{' '}
            <span style={{ background: 'linear-gradient(135deg, #7357D9, #83D9E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              accessible to everyone.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 640, margin: '0 auto 2.5rem' }}>
            Experience a smarter, more inclusive digital world with AI-powered voice assistance,
            intelligent image descriptions, text-to-speech and simplified information.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(135deg, #7357D9, #5A42C0)',
              color: 'white', textDecoration: 'none',
              padding: '0.875rem 2rem', borderRadius: 12, fontWeight: 700, fontSize: '1.05rem',
              boxShadow: '0 8px 32px rgba(115,87,217,0.45)',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(115,87,217,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(115,87,217,0.45)'; }}>
              Try AccessEase AI <ChevronRight size={18} aria-hidden="true" />
            </Link>
            <a href="#features" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', textDecoration: 'none',
              padding: '0.875rem 2rem', borderRadius: 12, fontWeight: 600, fontSize: '1.05rem',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}>
              Explore Features
            </a>
          </div>

          {/* Tagline */}
          <p style={{ marginTop: '2.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            See it · Hear it · Understand it · Access it
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', background: '#F7F8FC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(115,87,217,0.1)', color: '#7357D9', padding: '0.3rem 1rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#20283A', marginBottom: '1rem' }}>Four simple steps to accessibility</h2>
            <p style={{ color: '#778095', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>Designed to be intuitive for everyone, regardless of technical ability.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', boxShadow: '0 2px 12px rgba(23,36,58,0.06)', textAlign: 'center', border: '1px solid #EDF2F7', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(23,36,58,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(23,36,58,0.06)'; }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(115,87,217,0.12), rgba(131,217,232,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#7357D9' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#20283A' }}>{item.title}</h3>
                <p style={{ color: '#778095', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(131,217,232,0.15)', color: '#2C8FA0', padding: '0.3rem 1rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Core Features</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#20283A', marginBottom: '1rem' }}>Everything you need, all in one place</h2>
            <p style={{ color: '#778095', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>Five powerful accessibility tools designed to work together seamlessly.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <Link key={i} to={f.to} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: '#F7F8FC', borderRadius: 20, padding: '2rem', border: '1px solid #EDF2F7', transition: 'all 0.25s', height: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(23,36,58,0.1)'; e.currentTarget.style.borderColor = f.color + '40'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#EDF2F7'; }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: f.color }}>
                    <f.icon size={26} aria-hidden="true" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#20283A', marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ color: '#778095', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>{f.description}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: f.color, fontSize: '0.875rem', fontWeight: 600 }}>
                    Try it now <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}

            {/* One-Click Mode Highlight */}
            <Link to="/one-click" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: 'linear-gradient(135deg, #17243A, #2D1B69)', borderRadius: 20, padding: '2rem', transition: 'all 0.25s', height: '100%', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(23,36,58,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(115,87,217,0.3) 0%, transparent 70%)' }} aria-hidden="true" />
                <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7357D9, #83D9E8)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.75rem', borderRadius: 999, marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Signature Feature</div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(115,87,217,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Accessibility size={26} color="#83D9E8" aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>One-Click Accessibility Mode</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>Upload any image. Get instant AI description, text extraction, simplified content and audio — all in one flow.</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#83D9E8', fontSize: '0.875rem', fontWeight: 600 }}>
                  Try One-Click Mode <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY ACCESSEASE */}
      <section id="why" style={{ padding: '5rem 1.5rem', background: '#F7F8FC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', background: 'rgba(115,87,217,0.1)', color: '#7357D9', padding: '0.3rem 1rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Why AccessEase AI</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#20283A', marginBottom: '1rem', lineHeight: 1.2 }}>Built from the ground up for accessibility</h2>
              <p style={{ color: '#778095', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                We believe technology should work for everyone — not just those without disabilities.
                AccessEase AI is designed with inclusivity as a core value, not an afterthought.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['WCAG 2.2 AA design practices', 'No registration required', 'Privacy-first — no data stored', 'Works in modern browsers'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={18} color="#7357D9" aria-hidden="true" />
                    <span style={{ color: '#4A5568', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {WHY_ITEMS.map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #EDF2F7', boxShadow: '0 2px 8px rgba(23,36,58,0.05)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg, rgba(115,87,217,0.12), rgba(131,217,232,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem', color: '#7357D9' }}>
                    <item.icon size={20} aria-hidden="true" />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#20283A', marginBottom: '0.4rem' }}>{item.title}</h3>
                  <p style={{ color: '#778095', fontSize: '0.825rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'linear-gradient(135deg, #17243A, #2D1B69)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform Overview — Illustrative Demo Data</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {DEMO_STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#83D9E8', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.25rem' }}>{s.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'white', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #7357D9, #83D9E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Accessibility size={36} color="white" aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#20283A', marginBottom: '1rem' }}>Start your accessible journey today</h2>
          <p style={{ color: '#778095', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            No account needed. No barriers. Just powerful, inclusive AI assistance at your fingertips.
          </p>
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #7357D9, #5A42C0)',
            color: 'white', textDecoration: 'none',
            padding: '1rem 2.5rem', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem',
            boxShadow: '0 8px 32px rgba(115,87,217,0.4)',
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(115,87,217,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(115,87,217,0.4)'; }}>
            Open AccessEase AI <ChevronRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#17243A', color: 'rgba(255,255,255,0.6)', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Accessibility size={18} color="#83D9E8" aria-hidden="true" />
            <span style={{ color: 'white', fontWeight: 700 }}>AccessEase AI</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Technology without barriers. Built for the CURSORFLOW Hackathon.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['/dashboard', '/settings'].map(to => (
              <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                {to === '/dashboard' ? 'Dashboard' : 'Settings'}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
