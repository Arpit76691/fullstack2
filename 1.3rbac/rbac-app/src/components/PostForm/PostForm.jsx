// PostForm
// Reusable form used for both creating and editing posts.
// We hide this from viewers entirely (so they never see "Create" UI).

import { useEffect, useState } from "react";

const CATEGORIES = [
  "Technology",
  "Security",
  "Design",
  "Backend",
  "Database",
  "DevOps",
  "Best Practices",
  "Testing",
  "Performance",
  "Tools",
];

const emptyPost = {
  title: "",
  description: "",
  category: "Technology",
};

const PostForm = ({ initialValue, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyPost);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValue) {
      setForm({
        title: initialValue.title || "",
        description: initialValue.description || "",
        category: initialValue.category || "Technology",
      });
    } else {
      setForm(emptyPost);
    }
  }, [initialValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Post title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write a short description..."
        />
      </div>

      {error && <div className="error-text">{error}</div>}

      <div className="form-row" style={{ marginTop: 12 }}>
        <button type="submit" className="btn">
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostForm;
