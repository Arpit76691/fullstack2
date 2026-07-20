import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPlatforms } from '../platforms/platformsSelectors';
import { addPost } from './postsSlice';

function AddPostForm() {
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? '');

  // Keep the dropdown in sync if the currently-selected platform is deleted.
  const effectivePlatformId = platforms.some((p) => p.id === platformId)
    ? platformId
    : platforms[0]?.id ?? '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !effectivePlatformId) return;
    dispatch(addPost({ title, body, platformId: effectivePlatformId }));
    setTitle('');
    setBody('');
  };

  return (
    <section className="card">
      <h2 className="card-title">Add a post</h2>
      <form onSubmit={handleSubmit} className="form-stack">
        <label className="form-label">
          Title
          <input
            className="input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the post about?"
            required
          />
        </label>
        <label className="form-label">
          Platform
          <select
            className="select"
            value={effectivePlatformId}
            onChange={(e) => setPlatformId(e.target.value)}
            required
            disabled={platforms.length === 0}
          >
            {platforms.length === 0 ? (
              <option value="">— add a platform first —</option>
            ) : (
              platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
        </label>
        <label className="form-label">
          Body
          <textarea
            className="textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the post content…"
            rows={3}
            required
          />
        </label>
        <div className="form-actions">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={platforms.length === 0}
          >
            Publish post
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddPostForm;
