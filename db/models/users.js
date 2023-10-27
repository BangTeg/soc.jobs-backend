'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Many-to-Many association with jobs through applications
      User.belongsToMany(models.Job, {
        through: 'Application',
        foreignKey: 'userId',
        otherKey: 'jobId',
        as: 'appliedJob',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING, // Add the 'avatar' field
    gender: DataTypes.ENUM(['Male', 'Female']),
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    cv: DataTypes.STRING,
    role: DataTypes.ENUM(['Admin', 'User']),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
