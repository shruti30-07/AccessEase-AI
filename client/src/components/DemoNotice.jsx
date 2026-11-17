import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DemoNotice({ isDemo }) {
  if (!isDemo) return null;
  return (
    <div className="alert alert-demo" role="status" aria-live="polite" style={{ marginBottom: '1.5rem' }}>
      <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
      <div>
        <strong>Demo Mode Active</strong> — This is sample content. The Grok AI API is not configured yet.
        To enable real AI responses, copy <code>server/.env.example</code> to <code>server/.env</code> and add your <code>XAI_API_KEY</code>.
      </div>
    </div>
  );
}
