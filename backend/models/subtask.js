import { Sequelize } from 'sequelize';
import sequelize from "../db-conn.js";
export const Subtask = sequelize.define('subtasks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'tasks',
      key: 'id',
    }
  },
  name: {
    type: Sequelize.STRING,
  },
	  manpower: {
    type: Sequelize.INTEGER,
	  },
	  completed: {
    type: Sequelize.BOOLEAN,
  },
},
{
  timestamps: false,
});