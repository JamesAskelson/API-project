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
        description: 'Funnest place in Detroit!',
        price: 156.45
      },
      {
        ownerId: '2',
        address: '123 Main St',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'New York Adventure Park',
        description: 'Experience the thrill of the Big Apple!',
        price: 129.99
      },
      {
        ownerId: '3',
        address: '789 Elm Ave',
        city: 'Chicago',
        state: 'Illinois',
        country: 'USA',
        lat: 41.8781,
        lng: -87.6298,
        name: 'Windy City Funland',
        description: 'Fun for the whole family!',
        price: 79.99
      },
      {
        ownerId: '1',
        address: '456 Pine St',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'LA Fun Zone',
        description: 'Get ready for excitement and adventure!',
        price: 179.99
      },
      {
        ownerId: '2',
        address: '321 Oak St',
        city: 'Miami',
        state: 'Florida',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Miami Fun Park',
        description: 'Enjoy the sunshine and thrills in Miami!',
        price: 149.99
      },
      {
        ownerId: '3',
        address: '987 Maple Ave',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Golden City Adventure Park',
        description: 'Experience unforgettable moments in San Francisco!',
        price: 199.99
      },
      {
        ownerId: '1',
        address: '654 Cedar Rd',
        city: 'Seattle',
        state: 'Washington',
        country: 'USA',
        lat: 47.6062,
        lng: -122.3321,
        name: 'Emerald City Funland',
        description: 'Enter a world of fun and imagination in Seattle!',
        price: 129.99
      },
      {
        ownerId: '2',
        address: '246 Willow St',
        city: 'Denver',
        state: 'Colorado',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Rocky Mountain Adventure Park',
        description: 'Experience adrenaline-pumping adventures in Denver!',
        price: 169.99
      },
      {
        ownerId: '3',
        address: '753 Cherry Ave',
        city: 'Austin',
        state: 'Texas',
        country: 'USA',
        lat: 30.2672,
        lng: -97.7431,
        name: 'Austin Fun Zone',
        description: 'Discover a world of fun and entertainment in Austin!',
        price: 119.99
      },
      {
        ownerId: '1',
        address: '135 Elm St',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'USA',
        lat: 42.3601,
        lng: -71.0589,
        name: 'Boston Thrillville',
        description: 'Get ready for thrills and excitement in Boston!',
        price: 139.99
      },
      {
        ownerId: '2',
        address: '864 Oak Rd',
        city: 'Nashville',
        state: 'Tennessee',
        country: 'USA',
        lat: 36.1627,
        lng: -86.7816,
        name: 'Music City Adventure Park',
        description: 'Experience unforgettable adventures in Nashville!',
        price: 149.99
      },
      {
        ownerId: '3',
        address: '975 Pine Rd',
        city: 'Orlando',
        state: 'Florida',
        country: 'USA',
        lat: 28.5383,
        lng: -81.3792,
        name: 'Magical Land of Fun',
        description: 'Enter a world of magic and fun in Orlando!',
        price: 189.99
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
