import { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import * as api from './api/todos';

const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const [todos,   setTodos]   = useState([]);
  const [filter,  setFilter]  = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async (f = filter) => {
    try {
      const { data } = await api.getTodos(f);
      setTodos(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [filter]);

  useEffect(() => { fetchTodos(); }, [filter]);

  const handleAdd = async (data) => {
    setLoading(true);
    try {
      await api.addTodo(data);
      await fetchTodos();
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    await api.toggleTodo(id);
    await fetchTodos();
  };

  const handleDelete = async (id) => {
    await api.deleteTodo(id);
    await fetchTodos();
  };

  const handleClearCompleted = async () => {
    await api.clearCompleted();
    await fetchTodos();
  };

  const total  = todos.length;
  const done   = todos.filter(t => t.done).length;
  const active = total - done;

  return (
    <>
      <h1>todo<span className="accent">.</span><span className="pink">mern</span></h1>

      <div className="stats">
        <div className="stat-card"><div className="stat-num purple">{total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-num pink">{active}</div><div className="stat-label">Active</div></div>
        <div className="stat-card"><div className="stat-num teal">{done}</div><div className="stat-label">Done</div></div>
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
          <button className="btn btn-danger" style={{marginLeft:'auto'}} onClick={handleClearCompleted}>
            Clear done
          </button>
        )}
      </div>

      <div className="todo-list">
        {todos.length === 0
          ? <div className="empty">No tasks here. Add one above!</div>
          : todos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
        }
      </div>
    </>
  );
}
