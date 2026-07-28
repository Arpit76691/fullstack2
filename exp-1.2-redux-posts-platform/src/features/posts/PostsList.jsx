import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, likePost } from './postsSlice';
import { selectFilteredAndSortedPosts } from './postsSelectors';
import EditPostModal from './EditPostModal';
import PostItem from './PostItem';
import RenderCounter from '../../components/RenderCounter';

function PostsList() {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Memoized selector: filters + sorts. The selector's argument-bearing
  // inputs return primitives, so memoization holds across renders without
  // us having to wrap them in useMemo.
  const visiblePosts = useSelector((state) =>
    selectFilteredAndSortedPosts(state, searchTerm, sortBy)
  );

  // Stable handler identities so memoized PostItem doesn't see new props
  // every render.
  const handleLike = useCallback(
    (id) => dispatch(likePost(id)),
    [dispatch]
  );
  const handleDelete = useCallback(
    (post) => {
      const confirmed = window.confirm(`Delete post "${post.title}"?`);
      if (confirmed) dispatch(deletePost(post.id));
    },
    [dispatch]
  );
  const handleEdit = useCallback((post) => setEditing(post), []);
  const handleCloseEdit = useCallback(() => setEditing(null), []);

  // Show a count next to the heading so we can see at a glance how many
  // posts passed the filter.
  const headerRight = useMemo(
    () => (
      <span className="card-subtitle">
        {visiblePosts.length} shown
      </span>
    ),
    [visiblePosts.length]
  );

  return (
    <section className="card">
      <div className="card-title-row">
        <h2 className="card-title">Posts</h2>
        {headerRight}
        <RenderCounter label="posts-list" position="inline" />
      </div>

      <div className="form-row post-controls">
        <input
          className="input"
          type="text"
          placeholder="Search title or body…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search posts"
        />
        <select
          className="select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort posts"
        >
          <option value="newest">Newest</option>
          <option value="most-liked">Most liked</option>
        </select>
      </div>

      {visiblePosts.length === 0 ? (
        <p className="empty-state">No posts match your filter.</p>
      ) : (
        <ul className="card-list">
          {visiblePosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {editing && <EditPostModal post={editing} onClose={handleCloseEdit} />}
    </section>
  );
}

export default PostsList;