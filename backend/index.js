
import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos.js';

const app = express();
const port = 3000;

const allowedOrigin = 'http://localhost:5173'; 
app.use(
  cors({
    origin: allowedOrigin,
    allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
  })
);

app.use(express.json());

app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});