'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const enumName = 'enum_shop_items_type';
    const enumName2 = 'enum_shop_items_category';

    await queryInterface.sequelize.query(
      `ALTER TYPE "${enumName}" ADD VALUE 'voucher';`,
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "${enumName2}" ADD VALUE 'Vouchers';`,
    );
  },

  async down(queryInterface, Sequelize) {
    console.log(
      'Nilai "voucher" tidak dihapus dari ENUM untuk menjaga integritas data.',
    );
    return Promise.resolve();
  },
};
