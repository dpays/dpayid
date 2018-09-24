'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('apps', [
      {
        client_id: 'dsocial.app',
        secret: 'O47PmRPZ688FPqQX3G41Su8JGVKA8n29b75qyE2gDoMMtBkaKTe0wmDdiQFSq1i5nYt',
        owner: 'dpay',
        redirect_uris: JSON.stringify(['https://dsocial.io/callback']),
        name: 'dSocial.io',
        description: 'Ensuring compensation for the creators of value',
        icon: 'http://build.dpays.io/42553098.png',
        website: 'https://dsocial.io',
        beneficiaries: JSON.stringify([{ account: 'dpay', weight: 1500 }]),
        is_approved: true,
        is_public: true,
        is_disabled: false,
        allowed_ips: JSON.stringify(['0.0.0.0', '::1']),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 'dsite.app',
        secret: 'vrJSZj4Vy5SYzInjlR4wDl5OjrXhpRPxUvq5ccS2QESPWBJ5EBjzfmCDcY7HtiC1yLz',
        owner: 'dpay',
        redirect_uris: JSON.stringify(['https://signup.dsite.io/callback']),
        name: 'dSite.io',
        description: 'Ensuring compensation for the creators of value',
        icon: 'http://build.dpays.io/42911480.png',
        website: 'https://dsite.io',
        beneficiaries: JSON.stringify([{ account: 'dpay', weight: 1500 }]),
        is_approved: true,
        is_public: true,
        is_disabled: false,
        allowed_ips: JSON.stringify(['0.0.0.0', '::1']),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('apps', null, {});
  },
};
