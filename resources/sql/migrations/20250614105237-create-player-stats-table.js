'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('player_stats', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: { model: 'users', key: 'userId' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tasksCompleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalXpEarned: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalCreditsEarned: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      longestMissionStreak: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('player_stats');
  },
};
