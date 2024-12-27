import express from 'express';
const router = express.Router();
import User from '../models/user.js';


router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body); 
    res.status(201).json({ message: 'User created', user: user});
  } catch (error) {
    res.status(500).json({message: 'Error registering user', error: error});
  }
});
export default router;