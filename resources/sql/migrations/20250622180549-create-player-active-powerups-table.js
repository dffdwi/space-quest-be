'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('player_active_powerups', {
      activePowerUpId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      itemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'shop_items',
          key: 'itemId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      usesLeft: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Jumlah pemakaian yang tersisa',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu kedaluwarsa untuk power-up berbasis durasi',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('player_active_powerups');
  },
};
