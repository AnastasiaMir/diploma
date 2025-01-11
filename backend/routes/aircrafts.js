import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Aircraft from '../models/aircraft.js';
import Task from '../models/task.js'; 
import { body, validationResult } from 'express-validator';

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
  try {
    const aircraft = await Aircraft.findOne({ where: { id, user_id: req.user.id } });
    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    res.status(200).json(aircraft);
  } catch (error) {
    console.error('Error in GET /aircrafts/:id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.get('/', authenticateToken, async (req, res) => {
  try {
    const aircrafts = await Aircraft.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Task,
        as: 'tasks',
      }],
    });
    res.status(200).json(aircrafts);
  } catch (error) {
    console.error('Error in GET /aircrafts:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('name').notEmpty().trim().escape(),
    body('start_date').isISO8601(),
    body('finish_date').isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, start_date, finish_date, completed } = req.body;
    try {
      const newAircraft = await Aircraft.create({
        name,
        start_date,
        finish_date,
        completed,
        user_id: req.user.id
      });
      const createdAircraft = await Aircraft.findOne({
        where: { id: newAircraft.id },
        include: [{
          model: Task,
          as: 'tasks'
        }]
      });
      res.status(201).json(createdAircraft);
    } catch (error) {
      console.error('Error in POST /aircrafts:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);



router.put(
  '/:id',
  authenticateToken,
  [
    body('name').notEmpty().trim().escape(),
    body('start_date').isISO8601(),
    body('finish_date').isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, start_date, finish_date, completed } = req.body;
    try {
      const aircraft = await Aircraft.findOne({ where: { id, user_id: req.user.id } });
      if (!aircraft) {
        return res.status(404).json({ message: 'Aircraft not found' });
      }
      aircraft.name = name;
      aircraft.start_date = start_date;
      aircraft.finish_date = finish_date;
      aircraft.completed = completed;
      await aircraft.save();
      const updatedAircraft = await Aircraft.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        include: [{
          model: Task,
          as: 'tasks',
        }],
      });
      res.status(200).json(updatedAircraft);
    } catch (error) {
      console.error('Error in PUT /aircrafts/:id:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const aircraft = await Aircraft.findOne({ where: { id, user_id: req.user.id } });
    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    await Task.destroy({ where: { aircraft_id: id } });
    await aircraft.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /aircrafts/:id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.post(
  '/:aircraftId/tasks',
  authenticateToken,
  [
    body('name').notEmpty().trim().escape(),
    body('manpower').isInt(),
    body('completed').isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { aircraftId } = req.params;
    const { name, manpower, completed } = req.body;

    try {
      const aircraft = await Aircraft.findOne({ where: { id: aircraftId, user_id: req.user.id } });
      if (!aircraft) {
        return res.status(404).json({ message: 'Aircraft not found' });
      }
      const newTask = await Task.create({
        name,
        manpower,
        completed,
        aircraft_id: aircraftId,
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error in POST /aircrafts/:aircraftId/tasks:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);
router.get(
  '/:aircraftId/tasks',
  authenticateToken,
  async (req, res) => {
    const { aircraftId } = req.params;

    try {
      const aircraft = await Aircraft.findOne({ where: { id: aircraftId, user_id: req.user.id } });
      if (!aircraft) {
        return res.status(404).json({ message: 'Aircraft not found' });
      }
      const tasks = await Task.findAll({
        where: { aircraft_id: aircraftId },
      });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error in GET /aircrafts/:aircraftId/tasks:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);


router.post('/:aircraftId/tasks/bulk',
  authenticateToken,
  async (req, res) => {
    const { aircraftId } = req.params;
    const tasks = req.body;
    try {
      const aircraft = await Aircraft.findOne({ where: { id: aircraftId, user_id: req.user.id } });
      if (!aircraft) {
        return res.status(404).json({ message: 'Aircraft not found' });
      }
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ message: 'Invalid tasks data' });
      }

      for (const task of tasks) {
        if (!task.name || typeof task.name !== 'string' || !task.manpower || typeof task.manpower !== 'number' ) {
          return res.status(400).json({ message: 'Invalid task data' });
        }
      }

      await Task.bulkCreate(tasks.map((task) => ({ ...task, aircraft_id: aircraftId })));
      res.status(201).json({ message: 'Tasks created successfully' });
    } catch (error) {
      console.error('Error in POST /aircrafts/:aircraftId/tasks/bulk:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

export default router;