import { createSelector } from '@reduxjs/toolkit';

const selectPlatformsState = (state) => state.platforms;

export const selectAllPlatforms = createSelector(
  [selectPlatformsState],
  (platforms) => platforms.ids.map((id) => platforms.entities[id])
);

export const selectPlatformById = (state, id) => state.platforms.entities[id];
