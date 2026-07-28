import { useRef } from 'react';

// Dev-only render counter. Displays how many times this component (and its
// parent, by extension) has rendered. Not rendered in production builds.
//
// We mutate a ref during render so the count is synchronous with the render
// that produced it — useEffect would only update after commit and lag a frame.
export default function RenderCounter({ label, position = 'inline' }) {
  const countRef = useRef(0);
  countRef.current += 1;

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <span
      className={`render-counter render-counter--${position}`}
      title={`Render count for ${label}`}
    >
      {label} · {countRef.current}
    </span>
  );
}