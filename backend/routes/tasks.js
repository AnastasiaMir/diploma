import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Task from '../models/task.js';
import Subtask from '../models/subtask.js'; // импорт модели Subtask
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

router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { user_id: req.user.id } });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error in GET /tasks:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ where: { id, user_id: req.user.id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Error in GET /tasks/:id:', error);
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

        const { name, start_date, finish_date } = req.body;
        try {
            const newTask = await Task.create({
                name,
                start_date,
                finish_date,
                user_id: req.user.id,
            });
            res.status(201).json(newTask);
        } catch (error) {
            console.error('Error in POST /tasks:', error);
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
        const { name, start_date, finish_date } = req.body;
        try {
            const task = await Task.findOne({ where: { id, user_id: req.user.id } });
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            task.name = name;
            task.start_date = start_date;
            task.finish_date = finish_date;
            await task.save();
            res.status(200).json(task);
        } catch (error) {
            console.error('Error in PUT /tasks/:id:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);


router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ where: { id, user_id: req.user.id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error in DELETE /tasks/:id:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


router.post(
  '/:taskId/subtasks', // Added this route
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
        const { taskId } = req.params;
        const { name, manpower, completed } = req.body;

        try {
          const task = await Task.findOne({ where: { id: taskId, user_id: req.user.id } });
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            const newSubtask = await Subtask.create({
                name,
                manpower,
                completed,
               task_id: taskId,
            });
            res.status(201).json(newSubtask);
        } catch (error) {
            console.error('Error in POST /tasks/:taskId/subtasks:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);

router.get(
    '/:taskId/subtasks',
    authenticateToken,
    async (req, res) => {
        const { taskId } = req.params;

        try {
            const task = await Task.findOne({ where: { id: taskId, user_id: req.user.id } });
             if (!task) {
                    return res.status(404).json({ message: 'Task not found' });
                }
            const subtasks = await Subtask.findAll({
                where: { task_id: taskId },
            });
            res.status(200).json(subtasks);
        } catch (error) {
            console.error('Error in GET /tasks/:taskId/subtasks:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);

router.post('/:taskId/subtasks/bulk',
        authenticateToken,
            async (req, res) => {
             const { taskId } = req.params;
            const subtasks = req.body;
           try {
              const task = await Task.findOne({ where: { id: taskId, user_id: req.user.id } });
              if (!task) {
                    return res.status(404).json({ message: 'Task not found' });
              }
                if (!subtasks || !Array.isArray(subtasks)) {
                 return res.status(400).json({ message: 'Invalid subtasks data' });
               }

               for (const subtask of subtasks) {
                   if (!subtask.name || typeof subtask.name !== 'string' || !subtask.manpower || typeof subtask.manpower !== 'number' ) {
                     return res.status(400).json({ message: 'Invalid subtask data' });
                 }
               }

                  await Subtask.bulkCreate(subtasks.map((subtask) => ({ ...subtask, task_id: taskId })));
               res.status(201).json({ message: 'Subtasks created successfully' });
              } catch (error) {
               console.error('Error in POST /tasks/:taskId/subtasks/bulk:', error);
              res.status(500).json({ message: 'Internal server error', error: error.message });
              }
          });

export default router;