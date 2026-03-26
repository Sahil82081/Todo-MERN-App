import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

const API_URL = import.meta.env.VITE_API_URL;
const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Todos
  const fetchTodos = useCallback(async (f = filter) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/todos`, {
        params: { filter: f },
      });
      setTodos(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [filter]);

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  // 🔹 Add Todo
  const handleAdd = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/todos`, data);
      await fetchTodos();
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle Todo
  const handleToggle = async (id) => {
    await axios.patch(`${API_URL}/api/todos/${id}`);
    await fetchTodos();
  };

  // 🔹 Delete Todo
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/todos/${id}`);
    await fetchTodos();
  };

  // 🔹 Clear Completed
  const handleClearCompleted = async () => {
    await axios.delete(`${API_URL}/api/todos/completed`);
    await fetchTodos();
  };

  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  const active = total - done;

  return (
    <>
      <h1>todo<span className="accent">.</span><span className="pink">mern</span></h1>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-num purple">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-num pink">{active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-num teal">{done}</div>
          <div className="stat-label">Done</div>
        </div>
      </div>

      <TodoForm onAdd={handleAdd} loading={loading} />

      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        {done > 0 && (
          <button
            className="btn btn-danger"
            style={{ marginLeft: 'auto' }}
            onClick={handleClearCompleted}
          >
            Clear done
          </button>
        )}
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty">No tasks here. Add one above!</div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </>
  );
}