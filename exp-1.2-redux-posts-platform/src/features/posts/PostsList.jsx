import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlatformBadge from '../../components/PlatformBadge';
import { deletePost, likePost } from './postsSlice';
import { selectPostsWithPlatformName } from './postsSelectors';
import EditPostModal from './EditPostModal';

function PostsList() {
  const posts = useSelector(selectPostsWithPlatformName);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);

  const handleDelete = (post) => {
    const confirmed = window.confirm(`Delete post "${post.title}"?`);
    if (confirmed) dispatch(deletePost(post.id));
  };

  return (
    <section className="card">
      <h2 className="card-title">Posts</h2>
      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Add one on the left.</p>
      ) : (
        <ul className="card-list">
          {posts.map((post) => (
            <li key={post.id} className="card-item post-card">
              <div className="post-head">
                <h3 className="post-title">{post.title}</h3>
                <PlatformBadge name={post.platformName} />
              </div>
              <p className="post-body">{post.body}</p>
              <div className="post-foot">
                <button
                  className="btn btn-ghost like-btn"
                  onClick={() => dispatch(likePost(post.id))}
                  aria-label="Like post"
                >
                  ♥ {post.likes}
                </button>
                <div className="card-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setEditing(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditPostModal post={editing} onClose={() => setEditing(null)} />
      )}
    </section>
  );
}

export default PostsList;
