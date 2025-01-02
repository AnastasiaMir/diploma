import express from 'express';
const router = express.Router();
import { Task } from '../models/task.js';
import { Subtask } from '../models/subtask.js';
// GET /tasks
router.get('/', async (req, res) => {
    console.log('API: GET /tasks');
    try {
        const tasks = await Task.findAll({
          include: [{
                model: Subtask,
                as: 'subtasks'
            }]
        });
        res.status(200).json(tasks);
      } catch(error) {
        console.error('API: Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
      }
});
// POST /tasks
router.post('/', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch(error) {
        console.error('API: Error creating task:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});
// PUT /tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.update(req.body);
        res.status(200).json(task);
     } catch (error) {
       console.error('API: Error updating task:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
});
// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(204).send();
    } catch(error) {
         console.error('API: Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
});
export default router;