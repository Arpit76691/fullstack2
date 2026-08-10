import { memo } from 'react';
import RenderCounter from './RenderCounter';


function PlatformBadge({ name }) {
  return (
    <span className="badge-with-counter">
      <span className="badge">{name ?? 'Unknown'}</span>
      <RenderCounter label="badge" position="inline" />
    </span>
  );
}

export default memo(PlatformBadge);