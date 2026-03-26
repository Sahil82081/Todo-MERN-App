import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getTodos  = (filter) => api.get('/todos', { params: filter && filter !== 'all' ? { filter } : {} });
export const addTodo   = (data)   => api.post('/todos', data);
export const toggleTodo = (id)    => api.put(`/todos/${id}`, { toggle: true });
export const deleteTodo = (id)    => api.delete(`/todos/${id}`);
export const clearCompleted = ()  => api.delete('/todos/completed');
