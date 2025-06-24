'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const enumName = 'enum_shop_items_category';
    await queryInterface.sequelize.query(
      `ALTER TYPE "${enumName}" ADD VALUE 'Avatars';`,
    );
  },

  async down(queryInterface, Sequelize) {
    console.log(
      'Nilai "Avatars" tidak dihapus dari ENUM untuk menjaga integritas data.',
    );
    return Promise.resolve();
  },
};
