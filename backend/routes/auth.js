import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';

const router = express.Router();

// Регистрация пользователя
router.post(
  '/register',
  [
    body('username').notEmpty().trim().escape(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    try {
      console.log('Register: Start', { username });
      const existingUser = await User.findOne({ where: { username } });
      console.log('Register: existingUser', { existingUser });
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует!' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({ username, password: hashedPassword });
    
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      console.log('Register: token', { token });
    
      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, username: newUser.username },
        token: token
      });
      console.log('Register: Success');
    
    } catch (error) {
      console.log('Register: Error', { body: req.body, error });
      console.error('Register: Error message', error.message);
      res.status(500).json({ message: 'Внутрення ошибка сервера! попробуйте позднее' });
    }
  }
);

// Логин пользователя
router.post(
  '/login',
  [
    body('username').notEmpty().trim().escape(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({
        token: token,
        user: { id: user.id, username: user.username }
      });

    } catch (error) {
      console.log('Error during login, body:', req.body, error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;