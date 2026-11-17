import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ icon: Icon, title, description, to, color = 'violet', badge }) {
  return (
    <div className="card card-elevated" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div className={`feature-icon feature-icon-${color}`}>
          {Icon && <Icon size={26} aria-hidden="true" />}
        </div>
        {badge && <span className="badge badge-violet">{badge}</span>}
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>{description}</p>
      </div>
      <Link
        to={to}
        className="btn btn-secondary btn-sm"
        style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
        aria-label={`Open ${title} tool`}
      >
        Open Tool <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
