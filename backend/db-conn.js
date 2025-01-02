import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config({ path: '/home/anastasia/diploma/backend/.env' });
// dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD,{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
connectDB();
export default sequelize;