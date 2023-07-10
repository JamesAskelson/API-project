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
        stars: 4.5
      },
      {
        userId: 2,
        spotId: 1,
        review: "Was fun but the golf course staff wasn't the most friendliest bunch",
        stars: 2.5
      },
      {
        userId: 3,
        spotId: 2,
        review: "As the name says, one of the funnest places I've ever been, would go again",
        stars: 4.0
      },
      {
        userId: 1,
        spotId: 2,
        review: "Was ok, the fun was over hyped",
        stars: 3.0
      },
      {
        userId: 2,
        spotId: 4,
        review: "Super cool place, would revisit",
        stars: 4.5
      },
      {
        userId: 1,
        spotId: 5,
        review: "Wouldn't recommend, fear the roaches",
        stars: 2.5
      },
      {
        userId: 2,
        spotId: 6,
        review: "Loved the atmosphere, food made me sick tho",
        stars: 2.0
      },
      {
        userId: 1,
        spotId: 6,
        review: "Amazing place, brought the whole family",
        stars: 4.5
      },
      {
        userId: 3,
        spotId: 7,
        review: "Had a super fun time, gonna tell everyone",
        stars: 4.0
      },
      {
        userId: 3,
        spotId: 8,
        review: "Wow, what a cool place",
        stars: 3.5
      },
      {
        userId: 1,
        spotId: 8,
        review: "One of the best places I have ever been to in my life",
        stars: 5.0
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, {}, {});
  }
};
