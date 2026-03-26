const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos
router.get('/', async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    if (filter === 'active')    query.done = false;
    if (filter === 'completed') query.done = true;
    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos
router.post('/', async (req, res) => {
  try {
    const { text, priority, category } = req.body;
    const todo = new Todo({ text, priority, category });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/todos/:id
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    if (req.body.toggle) {
      todo.done = !todo.done;
    } else {
      Object.assign(todo, req.body);
    }
    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/todos/completed
router.delete('/completed', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ done: true });
    res.json({ message: `Deleted ${result.deletedCount} completed todos` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
