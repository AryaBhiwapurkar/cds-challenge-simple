const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');
const ROLES = require('../utils/roles');

// Create Task - authenticated users
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({
      title,
      description,
      ownerUid: req.user.uid
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read tasks - admin gets all; user gets only own tasks
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role === ROLES.ADMIN) {
      const tasks = await Task.find().sort('-createdAt');
      return res.json(tasks);
    } else {
      const tasks = await Task.find({ ownerUid: req.user.uid }).sort('-createdAt');
      return res.json(tasks);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update - admin can update any; user only their own
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== ROLES.ADMIN && task.ownerUid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete - only admin can delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden: only admin can delete tasks' });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
