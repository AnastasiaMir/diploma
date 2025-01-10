import { DataTypes } from 'sequelize';
import sequelize from '../db-conn.js';

const Task = sequelize.define('tasks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manpower: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  aircraft_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  timestamps: false,
});

export default Task;