// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../db-conn.js';

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
   timestamps: false,  // <--- Add this line to disable timestamps
});

export default User;