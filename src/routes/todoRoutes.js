const express = require('express');
const Todo = require('../models/todo');
const   router = express.Router();

// Get all todos
router.get('/todos', async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

// Create a new todo
router.post('/todos', async (req, res) => {
  const { title } = req.body;
  const todo = await Todo.create({ title });
  res.status(201).json(todo);
});

// Update a todo
router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = await Todo.findByPk(id);
  if (todo) {
    if(title)       todo.title = title;
    if(completed)   todo.completed = completed;
    await todo.save();
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByPk(id);
  if (todo) {
    await todo.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

module.exports = router;
