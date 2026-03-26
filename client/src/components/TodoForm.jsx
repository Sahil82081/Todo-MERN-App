import { useState } from 'react';

export default function TodoForm({ onAdd, loading }) {
  const [text, setText]         = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await onAdd({ text: text.trim(), priority, category });
    setText('');
  };

  return (
    <div className="add-area">
      <div className="input-row">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Add a new task..."
        />
        <button className="btn" onClick={handleSubmit} disabled={loading || !text.trim()}>
          + Add
        </button>
      </div>
      <div className="meta-row">
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="work">💼 Work</option>
          <option value="personal">🏠 Personal</option>
          <option value="health">💪 Health</option>
          <option value="other">📦 Other</option>
        </select>
      </div>
    </div>
  );
}
