'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('player_stats', 'dailyPersonalXpGained', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('player_stats', 'dailyPersonalCpGained', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn(
      'player_stats',
      'lastPersonalTaskCompletionDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('player_stats', 'dailyPersonalXpGained');
    await queryInterface.removeColumn('player_stats', 'dailyPersonalCpGained');
    await queryInterface.removeColumn(
      'player_stats',
      'lastPersonalTaskCompletionDate',
    );
  },
};
