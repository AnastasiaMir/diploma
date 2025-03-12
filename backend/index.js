import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import aircraftRoutes from './routes/aircrafts.js';
import sequelize from './db-conn.js'; 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost'
}
app.use(cors(corsOptions));
app.use(express.json());

app.get('/api', (req, res) => {
    res.status(200).send('API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/aircrafts', aircraftRoutes);
app.use('/api/tasks', taskRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default app;
