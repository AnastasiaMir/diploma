import express from 'express';
const router = express.Router();
import { Subtask } from '../models/subtask.js';

// GET /subtasks?task_id=id_number
router.get('/', async (req, res) => {
    const taskId = req.query.task_id;
    console.log("API: GET /subtasks, taskId:", taskId);
    try {
         if (!taskId) {
            return res.status(400).json({ message: 'Missing task_id' });
          }
        const subtasks = await Subtask.findAll({
           where: {
              task_id: taskId,
           },
         });
        //  console.log('API response subtasks', subtasks);
          if (subtasks.length === 0) {
            return res.status(404).json({ message: 'Subtasks not found' });
          }
         res.status(200).json(subtasks);
      } catch (error) {
         console.error("API: Error", error);
        res.status(500).json({ message: 'Error subtasks' });
      }
  });

// POST /subtasks
router.post('/', async (req, res) => {
  try{
    const subtask = await Subtask.create(req.body);
    res.status(201).json(subtask);
  }catch(error){
     console.error("API: Error", error);
    res.status(500).json({ message: 'Error creating subtask'});
  }
});

// PUT /subtasks/:id
router.put('/:id', async(req, res) => {
  try{
    const id = req.params.id;
    const subtask = await Subtask.findByPk(id);
    if (!subtask){
      return res.status(404).json({ message: 'Subtask not found' });
    }
    await subtask.update(req.body);
    res.status(200).json(subtask);
  }catch(error){
     console.error("API: Error", error);
    res.status(500).json({ message: 'Error updating subtask'});
  }
});

// DELETE /subtasks/:id
router.delete('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const subtask = await Subtask.findByPk(id);
    if (!subtask){
      return res.status(404).json({ message: 'Subtask not found' });
    }
    await subtask.destroy();
    res.status(204).send();
  }catch(error){
    console.error("API: Error", error)
    res.status(500).json({message: 'Error deleting subtask'});
  }
});

export default router;