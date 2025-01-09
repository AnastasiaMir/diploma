import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Subtask from '../models/subtask.js';

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
    const subtask = await Subtask.findOne({ where: { id } });
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    res.status(200).json(subtask);
  } catch (error) {
    console.error('Error in GET /:id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, manpower, completed } = req.body;

  try {
    const subtask = await Subtask.findByPk(id);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    await subtask.update({ name, manpower, completed });
    res.json(subtask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const subtask = await Subtask.findOne({ where: { id } });
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    await subtask.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /:id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


export default router;