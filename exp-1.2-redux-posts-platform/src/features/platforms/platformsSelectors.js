import { createSelector } from '@reduxjs/toolkit';

const selectPlatformsState = (state) => state.platforms;

export const selectAllPlatforms = createSelector(
  [selectPlatformsState],
  (platforms) => platforms.ids.map((id) => platforms.entities[id])
);

export const selectPlatformById = (state, id) => state.platforms.entities[id];

// View-model shape for <select> elements. Recomputed only when platforms
// change; identity-stable across renders so React.memo'd children skip work.
export const selectPlatformOptions = createSelector(
  [selectAllPlatforms],
  (platforms) => platforms.map((p) => ({ value: p.id, label: p.name }))
);