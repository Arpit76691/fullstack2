// Posts page
// Implements CRUD using localStorage for persistence.
// Role-based UI: viewers can't see create/edit/delete buttons.

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import postsSeed from "../../data/posts";
import { postsStorage } from "../../utils/storage";
import PostTable from "../../components/PostTable/PostTable";
import PostForm from "../../components/PostForm/PostForm";
import Modal from "../../components/Modal/Modal";

const Posts = () => {
  const { user, role } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  // Hydrate posts: localStorage first, then seed
  useEffect(() => {
    const stored = postsStorage.getAll();
    if (Array.isArray(stored)) {
      setPosts(stored);
    } else {
      setPosts(postsSeed);
      postsStorage.setAll(postsSeed);
    }
  }, []);

  const persist = (next) => {
    setPosts(next);
    postsStorage.setAll(next);
  };

  const handleCreate = (form) => {
    const nextId = posts.length
      ? Math.max(...posts.map((p) => p.id)) + 1
      : 1;
    const newPost = {
      id: nextId,
      title: form.title,
      description: form.description,
      category: form.category,
      author: user?.username || "unknown",
      createdAt: new Date().toISOString(),
    };
    persist([newPost, ...posts]);
    setCreating(false);
  };

  const handleEditSave = (form) => {
    const next = posts.map((p) =>
      p.id === editing.id
        ? { ...p, title: form.title, description: form.description, category: form.category }
        : p
    );
    persist(next);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!confirmDel) return;
    persist(posts.filter((p) => p.id !== confirmDel.id));
    setConfirmDel(null);
  };

  // Role gating: only show "Create Post" to admin/editor
  const canCreate = role === "admin" || role === "editor";

  return (
    <div className="page">
      <div className="flex-between mb-16">
        <h2 className="page-title" style={{ margin: 0 }}>Posts</h2>
        {canCreate && (
          <button className="btn" onClick={() => setCreating(true)}>
            + New Post
          </button>
        )}
      </div>

      <PostTable
        posts={posts}
        onEdit={(p) => {
          // Editor rule: editors can only edit their own posts.
          if (role === "editor" && p.author !== user?.username) {
            // Silently ignore — the button is hidden but defense-in-depth.
            return;
          }
          setEditing(p);
        }}
        onDelete={(p) => setConfirmDel(p)}
      />

      {/* Create modal */}
      <Modal
        open={creating}
        title="Create Post"
        onClose={() => setCreating(false)}
      >
        <PostForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={Boolean(editing)}
        title="Edit Post"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <PostForm
            initialValue={editing}
            onSubmit={handleEditSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={Boolean(confirmDel)}
        title="Confirm Delete"
        onClose={() => setConfirmDel(null)}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setConfirmDel(null)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      >
        {confirmDel && (
          <p>
            Are you sure you want to delete <strong>{confirmDel.title}</strong>?
            This cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Posts;