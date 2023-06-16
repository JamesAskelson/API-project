'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: '2021-10-10',
        endDate: '2021-10-12'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2021-7-12',
        endDate: '2021-7-15'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-7-12',
        endDate: '2023-7-15'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2023-6-14',
        endDate: '2023-6-16'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2023-6-13',
        endDate: '2023-6-16'
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, {}, {});
  }
};
