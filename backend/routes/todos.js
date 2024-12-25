// routes/todos.js
import express from 'express';
import Todo from '../models/todo.js';

const router = express.Router();

// GET all todos
router.get('/', async (req, res) => {
    try {
      const allTodos = await Todo.findAll();
        res.json(allTodos);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

// GET a todo by ID
router.get('/:id', async (req, res) => {
  try {
      const todo = await Todo.findByPk(req.params.id);
      if(!todo){
           return res.status(404).send({message: "Todo not found"});
      }
        res.json(todo);
  } catch (err) {
       console.error(err);
       res.status(500).send({ message: 'Server error' });
  }
});

// POST create a new todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).send({ message: 'Title is required' });
    }
    const newTodo = await Todo.create({ title });
    res.status(201).json(newTodo);
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
  }
});


// PUT update a todo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo = await Todo.findByPk(id);
      if(!todo){
        return res.status(404).send({message: "Todo not found"});
    }
    const updatedTodo = await todo.update({
      title,
      completed,
    });
      res.json(updatedTodo);
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
  }
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
          if(!todo){
             return res.status(404).send({message: "Todo not found"});
          }
         await todo.destroy();
         res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

export default router;