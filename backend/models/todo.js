
import { DataTypes } from 'sequelize';
import sequelize from '../db-conn.js';

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
},
    {
     tableName: 'todos',
   },
);

export default Todo;