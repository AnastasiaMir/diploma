import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import aircraftRoutes from './routes/aircrafts.js';

dotenv.config({ path: '/home/anastasia/diploma/backend/.env' });

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/aircrafts', aircraftRoutes);
app.use('/api/tasks', taskRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;