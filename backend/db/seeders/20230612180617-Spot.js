'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: '1',
        address: '135 Spring Rd',
        city: 'Detroit',
        state: 'Michigan',
        country: 'USA',
        lat: 42.353687,
        lng: -83.134912,
        name: 'Detroit Funtown USA',
        description: 'Funnest place in detroit!',
        price: 156
      },
      {
        ownerId: '2',
        address: '512 Wolf Ave',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 37.769761,
        lng: -122.428150,
        name: 'Fred"s Golf Resort',
        description: 'Perfect place for golf',
        price: 16
      },
      {
        ownerId: '3',
        address: '1024 Arnold Rd',
        city: 'Dallas',
        state: 'Texas',
        country: 'USA',
        lat: 32.743780,
        lng: -96.813345,
        name: 'Hog Wrangler Association',
        description: 'Best place to learn how to wrangle hogs',
        price: 36
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
