'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 3,
        review: "Best hog wrangling i've ever experienced",
        rating: 4.5
      },
      {
        userId: 2,
        spotId: 2,
        review: "Was fun but the golf course staff wasn't the most friendliest bunch",
        rating: 2.5
      },
      {
        userId: 3,
        spotId: 1,
        review: "As the name says, one of the funnest places I've ever been, would go again",
        rating: 4.0
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, {}, {});
  }
};
