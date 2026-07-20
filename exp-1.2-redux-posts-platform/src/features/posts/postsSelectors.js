import { createSelector } from '@reduxjs/toolkit';

const selectPostsState = (state) => state.posts;
const selectPlatformsState = (state) => state.platforms;

export const selectAllPosts = createSelector(
  [selectPostsState],
  (posts) => posts.ids.map((id) => posts.entities[id])
);

export const selectPostById = (state, id) => state.posts.entities[id];

export const selectPostsByPlatform = createSelector(
  [selectAllPosts, (state, platformId) => platformId],
  (posts, platformId) => posts.filter((p) => p.platformId === platformId)
);

const selectPlatformsMap = createSelector(
  [selectPlatformsState],
  (platforms) => platforms.entities
);

export const selectPostsWithPlatformName = createSelector(
  [selectAllPosts, selectPlatformsMap],
  (posts, platformMap) =>
    posts.map((post) => ({
      ...post,
      platformName: platformMap[post.platformId]?.name ?? 'Unknown',
    }))
);

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
