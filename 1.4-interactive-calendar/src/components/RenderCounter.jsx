// RenderCounter — pure display component. Subscribes to the shared render
// count store via useSyncExternalStore so the number updates live as App /
// Calendar / PostCard re-render and call reportRender(name).
//
// We deliberately do NOT call reportRender from inside this component.
// The components being counted (App, Calendar, PostCard) are responsible for
// reporting their own renders. If RenderCounter also reported, every re-render
// of the counter itself would bump the count, creating a feedback loop.

import { useSyncExternalStore } from 'react';
import { subscribe, getCounts } from '../renderCountStore';

export default function RenderCounter({ name, color = '#2563eb' }) {
  const counts = useSyncExternalStore(subscribe, getCounts, getCounts);
  const value = counts[name] || 0;

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: '999px',
    background: 'var(--bg)',
    border: `1px solid ${color}`,
    fontSize: '12px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    color: 'var(--text)',
    fontWeight: 500,
  };
  const dotStyle = {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: color,
  };

  return (
    <span style={containerStyle} data-testid={`render-counter-${name}`}>
      <span style={dotStyle} />
      <span>{name}: {value}</span>
    </span>
  );
}
