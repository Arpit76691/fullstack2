import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPlatforms } from '../platforms/platformsSelectors';
import { updatePost } from './postsSlice';

function EditPostModal({ post, onClose }) {
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [platformId, setPlatformId] = useState(post.platformId);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !platformId) return;
    dispatch(updatePost({ id: post.id, title, body, platformId }));
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="card-title">Edit post</h2>
        <form onSubmit={handleSave} className="form-stack">
          <label className="form-label">
            Title
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </label>
          <label className="form-label">
            Platform
            <select
              className="select"
              value={platformId}
              onChange={(e) => setPlatformId(e.target.value)}
              required
            >
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Body
            <textarea
              className="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
            />
          </label>
          <div className="form-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
