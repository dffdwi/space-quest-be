'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('missions', {
      missionId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('once', 'daily', 'weekly'),
        allowNull: false,
      },
      target: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Target progres untuk menyelesaikan misi',
      },
      rewardXp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rewardCredits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rewardBadgeId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'badges',
          key: 'badgeId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('missions');
  },
};
