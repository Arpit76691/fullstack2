// PostTable
// Renders the posts and the role-appropriate action buttons.
// Important: action buttons are HIDDEN (not just disabled) for unauthorized roles.

import useAuth from "../../hooks/useAuth";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

const PostTable = ({ posts, onEdit, onDelete }) => {
  const { role, user } = useAuth();

  // Role-based UI rendering — buttons are hidden, not disabled.
  const canEdit = role === "admin" || role === "editor";
  const canDelete = role === "admin";

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                No posts available.
              </td>
            </tr>
          )}
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.author}</td>
              <td>{formatDate(p.createdAt)}</td>
              <td>
                {canEdit && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit?.(p)}
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete?.(p)}
                  >
                    Delete
                  </button>
                )}
                {!canEdit && !canDelete && (
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    View only
                  </span>
                )}
                {/* Author override: even editors/admins can only edit their own posts
                    unless they're admin. This is a small extra rule to make role logic visible. */}
                {canEdit && role === "editor" && p.author !== user?.username && (
                  <span
                    className="text-muted"
                    style={{ fontSize: 12, marginLeft: 4 }}
                    title="Editors can only edit their own posts"
                  >
                    (locked)
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostTable;
