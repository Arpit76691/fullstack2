// Optimization toggles — each hook has its own switch so the user can flip
// them independently. All three start ON.
//   - memoOn: PostCard is wrapped in React.memo (skips re-render when props unchanged)
//   - useMemoOn: Calendar postsByDay map is memoized
//   - useCallbackOn: App handlers + Calendar event handlers use useCallback
//
// Calendar uses native HTML5 drag-and-drop:
//   - each post chip has draggable + onDragStart
//   - each day cell has onDragOver (preventDefault) + onDrop
//   - on drop, App dispatches reschedulePost with the new date
//
// Render counts are reported to a shared external store (renderCountStore.js)
// and read live by RenderCounter + PerformancePanel via useSyncExternalStore,
// so they update in real time without App needing to mirror them into state.
import { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePost, reschedulePost } from './store/postSlice';
import PostForm from './components/PostForm';
import Calendar from './components/Calendar';
import PostCard from './components/PostCard';
import RenderCounter from './components/RenderCounter';
import PerformancePanel from './components/PerformancePanel';
import { reportRender } from './renderCountStore';

// React.memo — skips re-render if props unchanged. Hoisted to module scope so
// the wrapper identity is stable across renders.
const PostCardMemo = memo(PostCard);

export default function App() {
  // Report this render to the external store so the live counters tick.
  reportRender('App');

  // Optimization toggles — each controls a real rendering behavior.
  const [memoOn, setMemoOn] = useState(true);
  const [useMemoOn, setUseMemoOn] = useState(true);
  const [useCallbackOn, setUseCallbackOn] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  // Stable handlers when useCallback is ON; recreated every render when OFF.
  const handleEditStable = useCallback((post) => setEditingPost(post), []);
  const handleDeleteStable = useCallback((id) => dispatch(deletePost(id)), [dispatch]);
  const handlePostDropStable = useCallback(
    (id, newDate) => dispatch(reschedulePost({ id, date: newDate })),
    [dispatch],
  );
  const handlePostClickStable = useCallback((post) => setEditingPost(post), []);

  const handleEditPlain = (post) => setEditingPost(post);
  const handleDeletePlain = (id) => dispatch(deletePost(id));
  const handlePostDropPlain = (id, newDate) =>
    dispatch(reschedulePost({ id, date: newDate }));
  const handlePostClickPlain = (post) => setEditingPost(post);

  const handleEdit = useCallbackOn ? handleEditStable : handleEditPlain;
  const handleDelete = useCallbackOn ? handleDeleteStable : handleDeletePlain;
  const handlePostDrop = useCallbackOn ? handlePostDropStable : handlePostDropPlain;
  const handlePostClick = useCallbackOn ? handlePostClickStable : handlePostClickPlain;

  // Selected post for the bottom detail panel — first one if none highlighted
  const selectedPost = editingPost || posts[0];

  const PostCardToUse = memoOn ? PostCardMemo : PostCard;

  const topbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    background: 'var(--panel)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  };
  const titleRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };
  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '320px 1fr 280px',
    gap: '16px',
    padding: '16px',
    alignItems: 'start',
  };
  const bottomStyle = {
    margin: '0 16px 16px',
    padding: '14px',
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
  };
  const toggleBtn = (on) => ({
    padding: '6px 12px',
    background: on ? 'var(--accent-soft)' : 'var(--danger-soft)',
    color: on ? 'var(--accent)' : 'var(--danger)',
    border: `1px solid ${on ? 'var(--accent)' : 'var(--danger)'}`,
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.01em',
  });

  return (
    <div>
      <div style={topbarStyle}>
        <div style={titleRowStyle}>
          <strong style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
            Interactive Post Scheduler
          </strong>
          <RenderCounter name="App" color="var(--primary)" />
        </div>
        <button
          type="button"
          data-testid="memo-toggle"
          onClick={() => setMemoOn((v) => !v)}
          style={toggleBtn(memoOn)}
          title="Wrap PostCard in React.memo"
        >
          React.memo: {memoOn ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          data-testid="usememo-toggle"
          onClick={() => setUseMemoOn((v) => !v)}
          style={toggleBtn(useMemoOn)}
          title="Cache Calendar events array"
        >
          useMemo: {useMemoOn ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          data-testid="usecallback-toggle"
          onClick={() => setUseCallbackOn((v) => !v)}
          style={toggleBtn(useCallbackOn)}
          title="Stabilize handler references"
        >
          useCallback: {useCallbackOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={layoutStyle}>
        <div>
          <PostForm editingPost={editingPost} onDone={() => setEditingPost(null)} />
        </div>

        <div>
          <Calendar
            posts={posts}
            onPostDrop={handlePostDrop}
            onPostClick={handlePostClick}
            useMemoOn={useMemoOn}
            useCallbackOn={useCallbackOn}
          />

          <div style={bottomStyle} data-testid="selected-post-panel">
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Selected Post</strong>
            {selectedPost ? (
              <PostCardToUse
                title={selectedPost.title}
                description={selectedPost.description}
                date={selectedPost.date}
                time={selectedPost.time}
                platform={selectedPost.platform}
                status={selectedPost.status}
                priority={selectedPost.priority}
                author={selectedPost.author}
              />
            ) : (
              <div style={{ color: 'var(--text-subtle)', fontSize: '13px', marginTop: '6px' }}>
                No post selected.
              </div>
            )}
          </div>
        </div>

        <div>
          <PerformancePanel
            memoOn={memoOn}
            useMemoOn={useMemoOn}
            useCallbackOn={useCallbackOn}
          />

          <div
            style={{
              marginTop: '12px',
              background: 'var(--panel)',
              padding: '14px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Posts</strong>
            <div style={{ maxHeight: '320px', overflowY: 'auto', marginTop: '8px' }}>
              {posts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '6px',
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleEdit(p)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                    }}
                  >
                    {p.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      background: 'var(--danger-soft)',
                      color: 'var(--danger)',
                      border: '1px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                    data-testid={`delete-${p.id}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}