'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Images';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        spotId: 3,
        url: "image url",
        preview: true
      },
      {
        reviewId: 2,
        spotId: 2,
        url: "image url",
        preview: true
      },
      {
        reviewId: 3,
        spotId: 1,
        url: "image url",
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Images';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
