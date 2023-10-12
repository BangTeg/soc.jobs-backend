'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('positions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      position_name: {
        type: Sequelize.ENUM(
          'Social Media Management',
          'UI/UX Design',
          'Branding',
          'Digital Advertising',
          'Live Streaming',
          'Photo & Video',
          'SEO & SEM',
          'Web Development',
          'Other'
          )
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('positions');
  }
};