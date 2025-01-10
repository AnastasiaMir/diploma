import { DataTypes } from 'sequelize';
import sequelize from '../db-conn.js';
import User from './user.js';
import Task from './task.js';

const Aircraft = sequelize.define('aircrafts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  finish_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  timestamps: false,
});

Aircraft.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Aircraft, { foreignKey: 'user_id' });

Aircraft.hasMany(Task, { foreignKey: 'aircraft_id', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Aircraft, { foreignKey: 'aircraft_id'});

export default Aircraft;