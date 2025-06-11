'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shop_items', {
      itemId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('theme', 'avatar_frame', 'power_up', 'cosmetic'),
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
        comment:
          'Contoh: nama tema (theme-nebula-dark) atau ID frame (gold-commander-frame)',
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.ENUM(
          'Ship Customization',
          'Commander Gear',
          'Consumables',
        ),
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Untuk power-up, jumlah pemakaian',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shop_items');
  },
};
