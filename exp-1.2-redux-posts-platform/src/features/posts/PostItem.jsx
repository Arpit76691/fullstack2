import { memo } from 'react';
import PlatformBadge from '../../components/PlatformBadge';
import RenderCounter from '../../components/RenderCounter';

// Receives only primitive props (id, title, body, likes, platformName) so
// React.memo's default shallow-equality check is sufficient — no callbacks
// or object identities to break the optimization.
function PostItem({ post, onLike, onEdit, onDelete }) {
  return (
    <li className="card-item post-card">
      <div className="post-head">
        <h3 className="post-title">{post.title}</h3>
        <PlatformBadge name={post.platformName} />
      </div>
      <p className="post-body">{post.body}</p>
      <div className="post-foot">
        <button
          className="btn btn-ghost like-btn"
          onClick={() => onLike(post.id)}
          aria-label="Like post"
        >
          ♥ {post.likes}
        </button>
        <div className="card-actions">
          <button className="btn btn-ghost" onClick={() => onEdit(post)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(post)}>
            Delete
          </button>
        </div>
        <RenderCounter label="post" position="corner" />
      </div>
    </li>
  );
}

export default memo(PostItem);