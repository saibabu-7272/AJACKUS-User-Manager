import React, { useEffect } from 'react';
import './index.css';

export default function Toasts({ items = [], onDismiss }) {
  useEffect(() => {
    const timers = items.map(t => setTimeout(() => onDismiss(t.id), t.duration || 3000));
    return () => timers.forEach(clearTimeout);
  }, [items, onDismiss]);

  if (!items.length) return null;

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          <span>{t.message}</span>
          <button className="close" aria-label="Dismiss notification" onClick={() => onDismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
