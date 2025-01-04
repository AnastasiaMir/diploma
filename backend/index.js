import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import subtaskRoutes from './routes/subtasks.js';

dotenv.config({ path: '/home/anastasia/diploma/backend/.env' });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);

 // Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;