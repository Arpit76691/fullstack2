import { configureStore } from '@reduxjs/toolkit';
import platformsReducer from '../features/platforms/platformsSlice';
import postsReducer from '../features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    platforms: platformsReducer,
    posts: postsReducer,
  },
});
