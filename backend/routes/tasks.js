import express from 'express';
const router = express.Router();
import { Task } from '../models/task.js';
import { Subtask } from '../models/subtask.js';

router.get('/', async (req, res) => {
  const tasks = await Task.findAll({ where: {user_id: req.user.id} });
  res.status(200).json(tasks);
});

router.post('/', async (req, res) => {
  try{
    const userId = req.user.id;
    const task = await Task.create({...req.body, user_id: userId});
    res.status(201).json(task);
  }catch(error){
    res.status(500).json({ message: 'Error creating task', error: error });
  }
});
router.put('/:id', async(req, res) => {
  try{
    const id = req.params.id;
    const task = await Task.findByPk(id);
    if (!task){
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.update(req.body);
    res.status(200).json(task);
  }catch(error){
    res.status(500).json({ message: 'Error updating task', error: error});
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const task = await Task.findByPk(id);
    if (!task){
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.status(204).json({message: 'Task deleted'});
  }catch(error){
    res.status(500).json({message: 'Error deleting task', error: error});
  }
});
router.get('/:id/subtasks', async(req, res) => {
  const id = req.params.id;
  try {
    const subtasks = await Subtask.findAll({where: {task_id: id}});
    res.status(200).json(subtasks);
  }catch(error){
    res.status(500).json({ message: 'Error getting subtasks', error: error});
  }
});

export default router;