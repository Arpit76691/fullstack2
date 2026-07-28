import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPlatforms } from './platformsSelectors';
import { addPlatform, updatePlatform, deletePlatform } from './platformsSlice';
import PlatformItem from './PlatformItem';
import RenderCounter from '../../components/RenderCounter';

function PlatformsList() {
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Stable handler identities so memoized PlatformItem can skip work.
  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      if (!name.trim()) return;
      dispatch(addPlatform(name));
      setName('');
    },
    [dispatch, name]
  );

  const startEdit = useCallback((platform) => {
    setEditingId(platform.id);
    setEditingName(platform.name);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingName.trim() || !editingId) return;
    dispatch(updatePlatform({ id: editingId, name: editingName }));
    setEditingId(null);
    setEditingName('');
  }, [dispatch, editingId, editingName]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingName('');
  }, []);

  const changeEditingName = useCallback((value) => setEditingName(value), []);

  const handleDelete = useCallback(
    (platform) => {
      const confirmed = window.confirm(
        `Delete platform "${platform.name}"? Posts referencing it will keep their platformId.`
      );
      if (confirmed) dispatch(deletePlatform(platform.id));
    },
    [dispatch]
  );

  return (
    <section className="card">
      <div className="card-title-row">
        <h2 className="card-title">Platforms</h2>
        <RenderCounter label="platforms-list" position="inline" />
      </div>

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
            <PlatformItem
              key={platform.id}
              platform={platform}
              isEditing={editingId === platform.id}
              editingName={editingName}
              onChangeEditingName={changeEditingName}
              onStartEdit={startEdit}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default PlatformsList;