import { Sequelize } from 'sequelize';
import sequelize from '../db-conn.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;


const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.TEXT,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
},
{
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')){
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
export default User;