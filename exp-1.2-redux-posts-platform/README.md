# Redux Toolkit — Posts & Platforms Demo

A small React app that demonstrates centralized state management with **Redux Toolkit** for two related entities: `posts` and `platforms`. Built as an academic demo for the course outcomes listed below.

> **CO1** — global state management · **CO2** — scalable state handling · **CO3** — normalized state structure

---

## Features

- ➕ Add, edit, and delete **platforms** (e.g., Twitter, LinkedIn, Reddit, Mastodon)
- ➕ Add, edit, and delete **posts**, each linked to a platform
- ❤️ Like posts — counts update everywhere instantly
- 📊 Live **stats bar** showing total posts, total platforms, total likes, and the most active platform
- 🧠 **Normalized** state (relational-style: `{ ids, entities }`)
- 🪝 Hooks-only component layer (`useSelector`, `useDispatch`) — **no prop drilling**

---

## Tech Stack

- **React 18** (function components + hooks)
- **Redux Toolkit** (`createSlice`, `nanoid`, `createSelector`, `configureStore`)
- **React-Redux** (`Provider`, `useSelector`, `useDispatch`)
- **Plain CSS** — no CSS-in-JS, no UI library
- **Create React App** as the build tool

---

## Screenshots

<!-- TODO: add a screenshot of the running app -->

---

## Setup

```bash
npx create-react-app redux-posts-platform
cd redux-posts-platform
npm install @reduxjs/toolkit react-redux
npm start
```

Then open <http://localhost:3000>.

---

## Project Structure

```
redux-posts-platform/
├── .gitignore
├── README.md
├── LICENSE
├── package.json
├── public/
└── src/
    ├── index.js                        Entry, wraps App with <Provider>
    ├── App.js                          Layout: Header, StatsBar, two columns
    ├── App.css                         Global / layout styles
    ├── store/
    │   └── index.js                    configureStore, combines slices
    ├── features/
    │   ├── platforms/
    │   │   ├── platformsSlice.js       Slice: state, reducers
    │   │   ├── platformsSelectors.js   createSelector exports
    │   │   └── PlatformsList.jsx       List + add/edit/delete UI
    │   └── posts/
    │       ├── postsSlice.js           Slice: state, reducers
    │       ├── postsSelectors.js       createSelector exports
    │       ├── PostsList.jsx           List with resolved platform name
    │       ├── AddPostForm.jsx         Create form
    │       └── EditPostModal.jsx       Edit form (modal)
    ├── components/
    │   ├── Header.jsx
    │   ├── StatsBar.jsx
    │   └── PlatformBadge.jsx
    └── styles/
        └── components.css
```

---

## Available Scripts

| Command           | What it does                                  |
|-------------------|-----------------------------------------------|
| `npm start`       | Run the dev server on <http://localhost:3000> |
| `npm run build`   | Production build into the `build/` folder     |
| `npm test`        | Run the CRA test runner                       |
| `npm run eject`   | Eject CRA config (one-way, not recommended)   |

---

## What this demo demonstrates

### CO1 — Global state management

A single Redux store is created in `src/store/index.js` and made available to the component tree via `<Provider>` in `src/index.js`. Every component reads state with `useSelector` and writes with `useDispatch` — there is **no prop drilling**, because the store is the single source of truth and any component can subscribe to any slice directly.

### CO2 — Scalable state handling

State is split into two **feature slices** (`platformsSlice` and `postsSlice`), each co-locating its state, action creators, and reducers. Derived data is computed with **memoized selectors** built on `createSelector`, so unrelated dispatches don't cause list re-renders. Adding a third feature (e.g., `users`) would only require a new folder under `src/features/` and one line in `configureStore`.

### CO3 — Normalized state

Both slices use the relational-style shape:

```js
{
  ids: ['p1', 'p2', 'p3'],
  entities: {
    p1: { id: 'p1', title: '...', platformId: 'twt', likes: 3, ... },
    p2: { ... },
    p3: { ... },
  },
}
```

Posts reference platforms by `platformId` (a foreign key) rather than nesting a platform object. Renaming a platform only updates one place; lookup is O(1) via `entities[id]`; iteration order is controlled by `ids`. This is the same pattern that RTK's `createEntityAdapter` produces — written by hand here to expose the underlying shape.

```
platforms.ids ──► platforms.entities[id]      (source of truth for platforms)
       ▲
       │ platformId (foreign key)
       │
posts.ids ──► posts.entities[id].platformId   (posts reference, never duplicate)
```

---

## Data model

```js
// Platform
{ id: 'twt', name: 'Twitter' }

// Post
{
  id: 'p1',
  title: 'RTK is great',
  body: 'Redux Toolkit removes all the boilerplate.',
  platformId: 'twt',   // foreign key into platforms.entities
  likes: 3,
  createdAt: 1700000000000,
}
```

---

## CRUD reducers

| Slice      | Action           | Payload                                  |
|------------|------------------|------------------------------------------|
| platforms  | `addPlatform`    | `name: string`                           |
| platforms  | `updatePlatform` | `{ id, name }`                           |
| platforms  | `deletePlatform` | `id`                                     |
| posts      | `addPost`        | `{ title, body, platformId }`            |
| posts      | `updatePost`     | `{ id, title, body, platformId }`        |
| posts      | `deletePost`     | `id`                                     |
| posts      | `likePost`       | `id`                                     |

All ids are generated with `nanoid()` (re-exported from `@reduxjs/toolkit`). Reducer bodies are powered by Immer, so you can write `state.entities[id].likes += 1` directly without manual spreading.

---

## License

[MIT](./LICENSE)
