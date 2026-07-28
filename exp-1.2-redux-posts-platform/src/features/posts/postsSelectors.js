import { createSelector } from '@reduxjs/toolkit';

const selectPostsState = (state) => state.posts;
const selectPlatformsState = (state) => state.platforms;

export const selectAllPosts = createSelector(
  [selectPostsState],
  (posts) => posts.ids.map((id) => posts.entities[id])
);

export const selectPostById = (state, id) => state.posts.entities[id];

// ---------------------------------------------------------------------------
// Derived / memoized selectors (Experiment 1.2.2)
// ---------------------------------------------------------------------------

// Posts filtered by a single platform. Memoized per `platformId` because
// createSelector caches its last result; this selector takes platformId as
// the second argument so each unique platform gets its own cached slice.
export const selectPostsByPlatformId = createSelector(
  [selectAllPosts, (state, platformId) => platformId],
  (posts, platformId) => posts.filter((p) => p.platformId === platformId)
);

// Filtered + sorted view used by PostsList. The component owns the
// searchTerm / sortBy arguments; the selector only recomputes when either
// the posts array or those primitive arguments change.
//
// IMPORTANT: keep the argument-bearing inputs primitive (not objects) so
// Reselect's default equality check returns true across renders.
export const selectFilteredAndSortedPosts = createSelector(
  [
    selectAllPosts,
    (state, searchTerm = '') => (searchTerm || '').trim().toLowerCase(),
    (state, searchTerm = '', sortBy = 'newest') => sortBy,
  ],
  (posts, normalizedSearch, sortBy) => {
    const filtered = normalizedSearch
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(normalizedSearch) ||
            p.body.toLowerCase().includes(normalizedSearch)
        )
      : posts;
    const sorted = [...filtered];
    if (sortBy === 'most-liked') {
      sorted.sort((a, b) => b.likes - a.likes);
    } else {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
    return sorted;
  }
);

// Groups posts by platformId. Derived state, recomputed only when the
// underlying posts array identity changes.
export const selectPostsGroupedByPlatform = createSelector(
  [selectAllPosts],
  (posts) => {
    const groups = {};
    for (const post of posts) {
      (groups[post.platformId] ||= []).push(post);
    }
    return groups;
  }
);

const selectPlatformsMap = createSelector(
  [selectPlatformsState],
  (platforms) => platforms.entities
);

// Per-platform breakdown: { id, name, postCount, totalLikes }. Useful for the
// "activity per platform" widget and for understanding derived data flow.
export const selectPlatformStats = createSelector(
  [selectAllPosts, selectPlatformsState],
  (posts, platforms) =>
    platforms.ids.map((id) => {
      const platformPosts = posts.filter((p) => p.platformId === id);
      const totalLikes = platformPosts.reduce((sum, p) => sum + p.likes, 0);
      return {
        id,
        name: platforms.entities[id]?.name ?? 'Unknown',
        postCount: platformPosts.length,
        totalLikes,
      };
    })
);

// Top-N posts by likes. Memoized; the limit is part of the cache key so
// changing the limit triggers a recompute.
export const selectTopPosts = createSelector(
  [selectAllPosts, (state, limit = 3) => limit],
  (posts, limit) =>
    [...posts].sort((a, b) => b.likes - a.likes).slice(0, limit)
);

// Posts joined with their platform name (existing — kept for back-compat).
export const selectPostsWithPlatformName = createSelector(
  [selectAllPosts, selectPlatformsMap],
  (posts, platformMap) =>
    posts.map((post) => ({
      ...post,
      platformName: platformMap[post.platformId]?.name ?? 'Unknown',
    }))
);

// Aggregate stats for the header bar (existing).
export const selectStats = createSelector(
  [selectAllPosts, selectPlatformsState],
  (posts, platforms) => {
    const postsPerPlatform = {};
    let totalLikes = 0;
    for (const post of posts) {
      postsPerPlatform[post.platformId] = (postsPerPlatform[post.platformId] || 0) + 1;
      totalLikes += post.likes;
    }
    let mostActivePlatformName = '—';
    let maxCount = 0;
    for (const id of Object.keys(postsPerPlatform)) {
      if (postsPerPlatform[id] > maxCount) {
        maxCount = postsPerPlatform[id];
        mostActivePlatformName = platforms.entities[id]?.name ?? '—';
      }
    }
    return {
      totalPosts: posts.length,
      totalPlatforms: platforms.ids.length,
      totalLikes,
      mostActivePlatformName,
    };
  }
);