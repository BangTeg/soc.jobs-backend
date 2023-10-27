'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      // Many-to-One associations
      Job.belongsTo(models.Experience, {
        foreignKey: "expId",
        as: "jobExperience"
      });
      Job.belongsTo(models.Type, {
        foreignKey: "typeId",
        as: "jobType"
      });
      Job.belongsTo(models.Position, {
        foreignKey: "positionId",
        as: "jobPosition"
      });

      // Many-to-Many association with users through applications
      Job.belongsToMany(models.User, {
        through: "Application",
        foreignKey: "jobId",
        otherKey: "userId",
        as: "jobApplicant"
      });
    }
  }
  Job.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    job_desc: DataTypes.TEXT,
    requirement: DataTypes.TEXT,
    logo: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    applicant: DataTypes.INTEGER,
    expId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    positionId: DataTypes.INTEGER,
    closedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};
