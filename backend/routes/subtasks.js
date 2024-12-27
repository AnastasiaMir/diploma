import express from 'express';
const router = express.Router();
import { Subtask } from '../models/subtask.js';

router.post('/', async (req, res) => {
  try{
    const subtask = await Subtask.create(req.body);
    res.status(201).json(subtask);
  }catch(error){
    res.status(500).json({ message: 'Error creating subtask', error: error });
  }
});
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
    res.status(500).json({ message: 'Error updating subtask', error: error});
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const subtask = await Subtask.findByPk(id);
    if (!subtask){
      return res.status(404).json({ message: 'Subtask not found' });
    }
    await subtask.destroy();
    res.status(204).json({message: 'Subtask deleted'});
  }catch(error){
    res.status(500).json({message: 'Error deleting subtask', error: error});
  }
});

export default router;