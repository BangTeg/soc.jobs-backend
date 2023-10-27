'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      // Many-to-Many association with users through jobs
      Application.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'Job'
      });
      Application.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
      });
    }
  }
  Application.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: DataTypes.INTEGER,
    jobId: DataTypes.INTEGER,
    status: DataTypes.ENUM([
      'Pending', 'Accepted', 'Rejected', 'Canceled'
  ])
  }, {
    sequelize,
    modelName: 'Application',
  });
  return Application;
};
