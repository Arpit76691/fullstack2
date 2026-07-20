import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPlatforms } from './platformsSelectors';
import { addPlatform, updatePlatform, deletePlatform } from './platformsSlice';

function PlatformsList() {
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(addPlatform(name));
    setName('');
  };

  const startEdit = (platform) => {
    setEditingId(platform.id);
    setEditingName(platform.name);
  };

  const saveEdit = () => {
    if (!editingName.trim() || !editingId) return;
    dispatch(updatePlatform({ id: editingId, name: editingName }));
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (platform) => {
    const confirmed = window.confirm(
      `Delete platform "${platform.name}"? Posts referencing it will keep their platformId.`
    );
    if (confirmed) dispatch(deletePlatform(platform.id));
  };

  return (
    <section className="card">
      <h2 className="card-title">Platforms</h2>

      <form className="form-row" onSubmit={handleAdd}>
        <input
          className="input"
          type="text"
          placeholder="New platform name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="New platform name"
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      {platforms.length === 0 ? (
        <p className="empty-state">No platforms yet. Add one above.</p>
      ) : (
        <ul className="card-list">
          {platforms.map((platform) => (
            <li key={platform.id} className="card-item">
              {editingId === platform.id ? (
                <>
                  <input
                    className="input"
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                  />
                  <div className="card-actions">
                    <button className="btn btn-primary" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn btn-ghost" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="badge">{platform.name}</span>
                  <div className="card-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => startEdit(platform)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(platform)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PlatformsList;
