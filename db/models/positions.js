const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    static associate(models) {
      // Define associations here
      Position.hasMany(models.Job, {
        foreignKey: 'positionId',
        as: 'jobs'
      });
    }
  }
  
  Position.init({
    position_name: DataTypes.ENUM([
      'Social Media Management',
      'UI/UX Design',
      'Branding',
      'Digital Advertising',
      'Live Streaming',
      'Photo & Video',
      'SEO & SEM',
      'Web Development',
      'Other'
    ])
  }, {
    sequelize,
    modelName: 'Position',
  });

  return Position;
};
