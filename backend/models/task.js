import { Sequelize } from 'sequelize';

import  sequelize  from "../db-conn.js";
export const Task = sequelize.define('tasks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users', 
      key: 'id',
    }
  },
  name: {
    type: Sequelize.STRING,
  },

	  start_date: {
    type: Sequelize.DATE,
	  },
	  finish_date: {
    type: Sequelize.DATE,
  },
},
{
  timestamps: false,
});