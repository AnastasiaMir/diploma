// models/task.js
import { DataTypes } from 'sequelize';
import sequelize from '../db-conn.js';
import User from './user.js';

const Task = sequelize.define('task', {
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
        allowNull: false, // <--- Add allowNull: false
    },
    finish_date: {
        type: DataTypes.DATE,
        allowNull: false, // <--- Add allowNull: false
    },
   user_id: {
          type: DataTypes.INTEGER,
         allowNull: false,
    }
},
{
    timestamps: false, // <-- отключите timestamps если они вам не нужны.
});

Task.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Task, { foreignKey: 'user_id' });

export default Task;