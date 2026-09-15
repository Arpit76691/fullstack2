// renderCountStore — external store for real-time render counts.
//
// Why external? The original implementation kept counts in App's local state and
// only mirrored them into the UI when a toggle flipped. That's not real-time:
// between toggles, the panel showed stale numbers.
//
// This module gives counters a place to report render events without causing
// re-renders that would themselves be counted (no feedback loops). We expose
// a subscribe/getSnapshot API so React components can read live values via
// useSyncExternalStore.
//
// Key design points:
//  - reportRender mutates the store and notifies subscribers. We schedule
//    notifications on a microtask so a single render pass (which may bump
//    several counters) triggers only one notification per subscriber.
//  - Subscribers are notified with the same identity the snapshot returns,
//    so React can bail when nothing changed.
//  - readCounts lets non-React code (tests, debug helpers) grab a snapshot.

let counts = { App: 0, Calendar: 0, PostCard: 0 };
const listeners = new Set();
let scheduled = false;

function flush() {
  scheduled = false;
  for (const l of listeners) l();
}

export function reportRender(name) {
  counts = { ...counts, [name]: (counts[name] || 0) + 1 };
  if (!scheduled) {
    scheduled = true;
    // queueMicrotask collapses multiple reports from one render into one notify
    queueMicrotask(flush);
  }
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCounts() {
  return counts;
}

// Reset helper — useful for tests and for the user via a debug button.
export function resetCounts() {
  counts = { App: 0, Calendar: 0, PostCard: 0 };
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(flush);
  }
}
