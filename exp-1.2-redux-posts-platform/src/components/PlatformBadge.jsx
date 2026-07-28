import { memo } from 'react';
import RenderCounter from './RenderCounter';

// Wrapped in React.memo: when its parent re-renders, this component skips
// reconciliation unless the `name` prop actually changes. This is the key
// optimization for derived-state components that would otherwise re-render
// on every state change in the store.
function PlatformBadge({ name }) {
  return (
    <span className="badge-with-counter">
      <span className="badge">{name ?? 'Unknown'}</span>
      <RenderCounter label="badge" position="inline" />
    </span>
  );
}

export default memo(PlatformBadge);