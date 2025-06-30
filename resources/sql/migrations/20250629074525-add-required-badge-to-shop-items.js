'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('shop_items', 'requiredBadgeId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'badges',
        key: 'badgeId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'ID lencana yang dibutuhkan untuk menukarkan item ini.',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('shop_items', 'requiredBadgeId');
  },
};
