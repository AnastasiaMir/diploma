import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config({ path: '/home/anastasia/diploma/backend/.env' });

  const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: `${process.env.DB_PASSWORD}`,
    port: parseInt(process.env.DB_PORT),
    define:{
      underscored: true,
    }
  });
  
  const connectDB = async () => {
      try {
          await sequelize.authenticate();
          console.log('Database connection has been established successfully.');
          await sequelize.sync({ alter: true });//Sync DB models
        } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    };
  
    connectDB();
  export default sequelize;