import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import sequelize from './db-conn.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import subtaskRoutes from './routes/subtasks.js';
import User from './models/user.js';
import { Task } from "./models/task.js";
import { Subtask } from './models/subtask.js';
import dotenv from 'dotenv'; 

dotenv.config();

const app = express();
const port = 3000;
const secret = process.env.JWT_SECRET;

User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });
Task.hasMany(Subtask, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Subtask.belongsTo(Task, { foreignKey: 'task_id' });

// sequelize.sync({alter: true});

const allowedOrigin = 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allows cookies
}));

app.use(express.json());


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - token missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden - Invalid token' });
  }
};


// Routes
app.use('/users', userRoutes); 
app.use('/tasks', verifyToken, taskRoutes); 
app.use('/subtasks', verifyToken, subtaskRoutes); 


// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Find user in db
  const user = await User.findOne({where: { username: username }});
  if (!user){
    return res.status(401).json({ message: 'Invalid user or password'});
  }
  const validPassword = await user.validPassword(password); // Check password
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
  res.json({ token });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});