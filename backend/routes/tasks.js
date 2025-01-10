import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Task from '../models/task.js';

const router = express.Router();

// Middleware для логирования всех запросов
router.use((req, res, next) => {
  console.log('Request:', req.method, req.url, req.body);
  res.on('finish', () => {
    console.log('Response:', res.statusCode, res.statusMessage);
  });
  next();
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log("req.params:", req.params);
  console.log("id в запросе:", id);
  try {
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error in GET /:id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // const { name, manpower, completed } = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: 'task not found' });
    }
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /:id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


export default router;