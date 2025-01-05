import { DataTypes } from 'sequelize';
import sequelize from '../db-conn.js';
import User from './user.js';
import Subtask from './subtask.js'

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

Task.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Task, { foreignKey: 'user_id' });

Task.hasMany(Subtask, { foreignKey: 'task_id', as: 'subtasks', onDelete: 'CASCADE' });
Subtask.belongsTo(Task, { foreignKey: 'task_id'});

export default Task;