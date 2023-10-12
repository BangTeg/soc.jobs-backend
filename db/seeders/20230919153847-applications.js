'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('applications', [
      {
        userId: 1,
        jobId: 1,
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        jobId: 1,
        status: 'Accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        jobId: 2,
        status: 'Rejected',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('applications', null, {});
  }
};
  