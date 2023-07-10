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
        description: "Explore the thrilling attractions and endless excitement in Detroit's ultimate fun destination!",
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
        description: "Embark on an exhilarating journey through the heart of New York City and experience the true essence of the Big Apple!",
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
        description: "Delight in a family-friendly adventure filled with non-stop fun and unforgettable memories in Chicago!",
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
        description: "Immerse yourself in a world of excitement and adventure at the vibrant LA Fun Zone in the heart of Los Angeles!",
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
        description: "Bask in the sunshine and indulge in thrilling experiences at Miami's premier destination for endless fun!",
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
        description: "Unleash your inner explorer and create lifelong memories at San Francisco's Golden City Adventure Park!",
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
        description: "Step into a world of imagination and discover a spectrum of fun-filled activities in Seattle's Emerald City Funland!",
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
        description: "Get your adrenaline pumping with thrilling adventures amidst the breathtaking beauty of Denver's Rocky Mountains!",
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
        description: "Dive into a realm of entertainment and discover boundless fun and excitement in Austin's vibrant Fun Zone!",
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
        description: "Brace yourself for heart-pounding thrills and exhilarating adventures in Boston's ultimate thrill destination!",
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
        description: "Immerse yourself in the soulful melodies and embark on unforgettable adventures in Nashville's Music City Adventure Park!",
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
        description: "Enter a realm of enchantment and experience the magic come to life at Orlando's Magical Land of Fun!",
        price: 189.99
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
