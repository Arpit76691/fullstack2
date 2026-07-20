import { createSlice, nanoid } from '@reduxjs/toolkit';

const seedPlatforms = [
  { id: 'twt', name: 'Twitter' },
  { id: 'lnk', name: 'LinkedIn' },
  { id: 'rdt', name: 'Reddit' },
  { id: 'mst', name: 'Mastodon' },
];

const initialState = {
  ids: seedPlatforms.map((p) => p.id),
  entities: seedPlatforms.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {}),
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    addPlatform: {
      reducer(state, action) {
        const { id, name } = action.payload;
        state.ids.push(id);
        state.entities[id] = { id, name };
      },
      prepare(name) {
        return { payload: { id: nanoid(6), name: name.trim() } };
      },
    },
    updatePlatform(state, action) {
      const { id, name } = action.payload;
      if (state.entities[id]) {
        state.entities[id].name = name.trim();
      }
    },
    deletePlatform(state, action) {
      const id = action.payload;
      state.ids = state.ids.filter((pid) => pid !== id);
      delete state.entities[id];
    },
  },
});

export const { addPlatform, updatePlatform, deletePlatform } = platformsSlice.actions;
export default platformsSlice.reducer;
