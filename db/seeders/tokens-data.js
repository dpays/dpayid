'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tokens', [
      {
        client_id: 'dsocial.app',
        user: 'jared',
        token: 'vrJSZj4Vy5SYzInjlR4wDl5OjrXhpRPxUvq5ccS2QESPWBJ5EBjzfmCDcY7HtiC1yLz',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tokens', null, {});
  }
};
