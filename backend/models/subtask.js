import { Sequelize } from 'sequelize';
import sequelize from "../db-conn.js";
export const Subtask = sequelize.define('subtasks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    // generatedAlwaysAsIdentity: true, does not work with sqlite
  },
  task_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'tasks', // Can be a string representing the table name
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