import React from 'react';
import { Settings as SettingsIcon, Type, Sun, Moon, Contrast, Eye, MousePointer, AlignLeft, Volume2, RotateCcw, Check } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';

export default function Settings() {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const SettingRow = ({ label, description, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--color-border-light)', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem', margin: 0 }}>{label}</p>
        {description && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)', margin: '0.2rem 0 0' }}>{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange, label }) => (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{ width: 48, height: 26, borderRadius: 999, background: checked ? 'var(--color-violet)' : 'var(--color-border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', top: 3, left: checked ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  );

  const ButtonGroup = ({ options, value, onChange, label }) => (
    <div role="radiogroup" aria-label={label} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button key={opt.value} role="radio" aria-checked={value === opt.value} onClick={() => onChange(opt.value)} className={`btn btn-sm ${value === opt.value ? 'btn-primary' : 'btn-ghost'}`}>
          {value === opt.value && <Check size={12} aria-hidden="true" />} {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="feature-icon feature-icon-violet"><SettingsIcon size={24} aria-hidden="true" /></div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>Accessibility Settings</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--font-size-sm)' }}>Customize AccessEase AI to suit your needs. Settings are saved automatically.</p>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Visual */}
          <div className="card card-elevated" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Type size={20} aria-hidden="true" /> Text &amp; Display</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', marginBottom: '1rem' }}>Adjust text and display for comfortable reading.</p>
            <SettingRow label="Font Size" description="Adjust how large text appears throughout the app.">
              <ButtonGroup
                label="Font size"
                value={settings.fontSize}
                onChange={v => updateSetting('fontSize', v)}
                options={[{ value: 'normal', label: 'Normal' }, { value: 'large', label: 'Large' }, { value: 'xlarge', label: 'XL' }]}
              />
            </SettingRow>
            <SettingRow label="Dyslexia-Friendly Font" description="Use OpenDyslexic font for easier reading.">
              <Toggle checked={settings.dyslexiaFont} onChange={v => updateSetting('dyslexiaFont', v)} label="Dyslexia-friendly font" />
            </SettingRow>
            <SettingRow label="Increased Line Spacing" description="Add more space between lines of text.">
              <Toggle checked={settings.lineSpacing === 'increased'} onChange={v => updateSetting('lineSpacing', v ? 'increased' : 'normal')} label="Increased line spacing" />
            </SettingRow>
          </div>

          {/* Theme */}
          <div className="card card-elevated" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sun size={20} aria-hidden="true" /> Appearance</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', marginBottom: '1rem' }}>Choose colors and theme that work best for you.</p>
            <SettingRow label="Color Theme" description="Switch between light and dark interface.">
              <ButtonGroup
                label="Color theme"
                value={settings.theme}
                onChange={v => updateSetting('theme', v)}
                options={[{ value: 'light', label: '☀️ Light' }, { value: 'dark', label: '🌙 Dark' }]}
              />
            </SettingRow>
            <SettingRow label="High Contrast" description="Increase contrast for better visibility.">
              <ButtonGroup
                label="Contrast mode"
                value={settings.contrast}
                onChange={v => updateSetting('contrast', v)}
                options={[{ value: 'normal', label: 'Normal' }, { value: 'high', label: 'High Contrast' }]}
              />
            </SettingRow>
          </div>

          {/* Motion & Interaction */}
          <div className="card card-elevated" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MousePointer size={20} aria-hidden="true" /> Motion &amp; Interaction</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', marginBottom: '1rem' }}>Control animations and button sizes.</p>
            <SettingRow label="Reduced Motion" description="Minimize animations and transitions.">
              <Toggle checked={settings.reducedMotion} onChange={v => updateSetting('reducedMotion', v)} label="Reduced motion" />
            </SettingRow>
            <SettingRow label="Larger Buttons" description="Increase the size of all buttons.">
              <Toggle checked={settings.largeButtons} onChange={v => updateSetting('largeButtons', v)} label="Larger buttons" />
            </SettingRow>
          </div>

          {/* Audio */}
          <div className="card card-elevated" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Volume2 size={20} aria-hidden="true" /> Audio</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', marginBottom: '1rem' }}>Adjust text-to-speech preferences.</p>
            <SettingRow label={`TTS Speed: ${settings.ttsSpeed.toFixed(1)}x`} description="Default speaking rate for text-to-speech.">
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={settings.ttsSpeed}
                onChange={e => updateSetting('ttsSpeed', Number(e.target.value))}
                style={{ width: 160, accentColor: 'var(--color-violet)' }}
                aria-label={`TTS speed: ${settings.ttsSpeed.toFixed(1)} times normal`}
              />
            </SettingRow>
          </div>
        </div>

        {/* Reset */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-white)', borderRadius: 16, border: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 600, margin: 0 }}>Reset All Settings</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', margin: '0.2rem 0 0' }}>Restore all accessibility settings to their default values.</p>
          </div>
          <button className="btn btn-ghost" onClick={resetSettings} aria-label="Reset all settings to default">
            <RotateCcw size={16} aria-hidden="true" /> Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
