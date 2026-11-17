import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  fontSize: 'normal',
  theme: 'light',
  contrast: 'normal',
  dyslexiaFont: false,
  reducedMotion: false,
  largeButtons: false,
  lineSpacing: 'normal',
  ttsSpeed: 1.0,
};

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('accessease-settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('accessease-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  function applySettings(s) {
    const root = document.documentElement;
    root.setAttribute('data-font-size', s.fontSize);
    root.setAttribute('data-theme', s.theme);
    root.setAttribute('data-contrast', s.contrast);
    root.setAttribute('data-dyslexia-font', String(s.dyslexiaFont));
    root.setAttribute('data-reduced-motion', String(s.reducedMotion));
    root.setAttribute('data-large-buttons', String(s.largeButtons));
    root.setAttribute('data-line-spacing', s.lineSpacing);
    root.style.colorScheme = s.theme === 'dark' ? 'dark' : 'light';
  }

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
