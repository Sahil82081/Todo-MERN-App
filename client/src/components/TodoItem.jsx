import { useState } from 'react';

function timeAgo(dateStr) {
  const s = Math.round((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.round(s/60)}m ago`;
  if (s < 86400) return `${Math.round(s/3600)}h ago`;
  return `${Math.round(s/86400)}d ago`;
}

export default function TodoItem({ todo, onToggle, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(todo._id);
  };

  return (
    <div className={`todo-item ${todo.done ? 'done' : ''}`}>
      <div
        className={`checkbox ${todo.done ? 'checked' : ''}`}
        onClick={() => onToggle(todo._id)}
      >
        {todo.done && '✓'}
      </div>
      <div className="todo-body">
        <div className="todo-text">{todo.text}</div>
        <div className="todo-meta">
          <div className={`priority-dot priority-${todo.priority}`} />
          <span className={`tag tag-${todo.category}`}>{todo.category}</span>
          <span className="todo-time">{timeAgo(todo.createdAt)}</span>
        </div>
      </div>
      <button className="btn-icon" onClick={handleDelete} disabled={deleting}>✕</button>
    </div>
  );
}
