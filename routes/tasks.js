const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticateUser } = require('../middleware/auth');


router.get('/', authenticateUser, async (req, res) => {
  try {
    
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    
    const todoTasks = tasks.filter(t => t.stage === 'todo');
    const progressTasks = tasks.filter(t => t.stage === 'in_progress');
    const doneTasks = tasks.filter(t => t.stage === 'done');

    res.render('dashboard', {
      title: 'Dashboard',
      todoTasks,
      progressTasks,
      doneTasks
    });
  } catch (err) {
    console.error('Fetch dashboard error:', err);
    res.status(500).send('Error loading dashboard.');
  }
});


router.post('/api/tasks', authenticateUser, async (req, res) => {
  const { title, description, stage, priority, dueDate } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const taskStage = stage || 'todo';
  if (!['todo', 'in_progress', 'done'].includes(taskStage)) {
    return res.status(400).json({ error: 'Invalid stage value' });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }

  try {
    const newTask = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      stage: taskStage,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});


router.put('/api/tasks/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title, description, stage, priority, dueDate } = req.body;

  if (title && title.trim() === '') {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  if (stage && !['todo', 'in_progress', 'done'].includes(stage)) {
    return res.status(400).json({ error: 'Invalid stage value' });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }

  try {
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (stage !== undefined) task.stage = stage;
    if (priority !== undefined) task.priority = priority;
    
    
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});


router.delete('/api/tasks/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Task.deleteOne({ _id: id, user: req.user.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;
