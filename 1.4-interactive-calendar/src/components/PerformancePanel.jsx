// PerformancePanel — shows per-hook status and live render counts.
// Counts are read live from the external render count store via
// useSyncExternalStore, so they update in real time as components re-render.

import { useSyncExternalStore } from 'react';
import { subscribe, getCounts, resetCounts } from '../renderCountStore';

export default function PerformancePanel({ memoOn, useMemoOn, useCallbackOn }) {
  const counts = useSyncExternalStore(subscribe, getCounts, getCounts);

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    fontSize: '13px',
    borderBottom: '1px solid var(--border)',
  };
  const labelStyle = { color: 'var(--text-muted)' };
  const valOn = { color: 'var(--accent)', fontWeight: 600 };
  const valOff = { color: 'var(--danger)', fontWeight: 600 };
  const sectionStyle = {
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: '1px solid var(--border)',
  };
  const sectionTitle = {
    fontSize: '11px',
    color: 'var(--text-subtle)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  };
  const resetBtn = {
    marginTop: '10px',
    padding: '5px 10px',
    fontSize: '12px',
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  };

  const tag = (on) => (on ? { text: 'Active', style: valOn } : { text: 'Inactive', style: valOff });

  return (
    <div
      style={{
        background: 'var(--panel)',
        padding: '14px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: 'var(--text)' }}>
        Performance Panel
      </h3>

      <div style={rowStyle}>
        <span style={labelStyle}>React.memo</span>
        <span style={tag(memoOn).style} data-testid="memo-status">
          {tag(memoOn).text}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>useMemo</span>
        <span style={tag(useMemoOn).style} data-testid="usememo-status">
          {tag(useMemoOn).text}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>useCallback</span>
        <span style={tag(useCallbackOn).style} data-testid="usecallback-status">
          {tag(useCallbackOn).text}
        </span>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitle}>Render Counts</div>
        <div style={rowStyle}>
          <span style={labelStyle}>App</span>
          <span data-testid="render-count-app">{counts.App || 0}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Calendar</span>
          <span data-testid="render-count-calendar">{counts.Calendar || 0}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>PostCard</span>
          <span data-testid="render-count-postcard">{counts.PostCard || 0}</span>
        </div>
        <button
          type="button"
          data-testid="reset-counts"
          style={resetBtn}
          onClick={() => resetCounts()}
        >
          Reset counts
        </button>
      </div>
    </div>
  );
}
