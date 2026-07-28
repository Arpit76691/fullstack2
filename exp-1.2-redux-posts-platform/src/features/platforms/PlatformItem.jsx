import { memo } from 'react';
import RenderCounter from '../../components/RenderCounter';

function PlatformItem({
  platform,
  isEditing,
  editingName,
  onChangeEditingName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <li className="card-item">
      {isEditing ? (
        <>
          <input
            className="input"
            type="text"
            value={editingName}
            onChange={(e) => onChangeEditingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onCancelEdit();
            }}
            autoFocus
          />
          <div className="card-actions">
            <button className="btn btn-primary" onClick={onSaveEdit}>
              Save
            </button>
            <button className="btn btn-ghost" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="badge">{platform.name}</span>
          <div className="card-actions">
            <button className="btn btn-ghost" onClick={() => onStartEdit(platform)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(platform)}>
              Delete
            </button>
          </div>
          <RenderCounter label="platform" position="corner" />
        </>
      )}
    </li>
  );
}

export default memo(PlatformItem);