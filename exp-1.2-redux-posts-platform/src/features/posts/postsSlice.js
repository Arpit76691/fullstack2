import { createSlice, nanoid } from '@reduxjs/toolkit';

const now = Date.now();

const seedPosts = [
  { id: 'p1', title: 'RTK is great',     body: 'Redux Toolkit removes all the boilerplate.',  platformId: 'twt', likes: 3, createdAt: now - 5000 },
  { id: 'p2', title: 'Hiring post',       body: 'Looking for a junior frontend engineer.',    platformId: 'lnk', likes: 0, createdAt: now - 4000 },
  { id: 'p3', title: 'Subreddit rules',   body: 'Be kind, no spam, use descriptive titles.',  platformId: 'rdt', likes: 7, createdAt: now - 3000 },
  { id: 'p4', title: 'Federation 101',    body: 'How the fediverse connects servers.',        platformId: 'mst', likes: 2, createdAt: now - 2000 },
  { id: 'p5', title: 'Thread on state',   body: 'Local state vs. global state, when to use.', platformId: 'twt', likes: 1, createdAt: now - 1000 },
];

const initialState = {
  ids: seedPosts.map((p) => p.id),
  entities: seedPosts.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {}),
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        const { id, title, body, platformId } = action.payload;
        state.ids.push(id);
        state.entities[id] = { id, title, body, platformId, likes: 0, createdAt: Date.now() };
      },
      prepare({ title, body, platformId }) {
        return {
          payload: {
            id: nanoid(6),
            title: title.trim(),
            body: body.trim(),
            platformId,
          },
        };
      },
    },
    updatePost(state, action) {
      const { id, title, body, platformId } = action.payload;
      const post = state.entities[id];
      if (post) {
        post.title = title.trim();
        post.body = body.trim();
        post.platformId = platformId;
      }
    },
    deletePost(state, action) {
      const id = action.payload;
      state.ids = state.ids.filter((pid) => pid !== id);
      delete state.entities[id];
    },
    likePost(state, action) {
      const id = action.payload;
      const post = state.entities[id];
      if (post) {
        post.likes += 1;
      }
    },
  },
});

export const { addPost, updatePost, deletePost, likePost } = postsSlice.actions;
export default postsSlice.reducer;
