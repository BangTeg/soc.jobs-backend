'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('positions', [
      {
        position_name: 'Social Media Management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'UI/UX Design',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'Branding',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'Digital Advertising',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'Live Streaming',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'Photo & Video',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'SEO & SEM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'Web Development',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        position_name: 'Other',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('positions', null, {});
  }
};
