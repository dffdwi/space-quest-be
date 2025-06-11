'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatarUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'avatar_url',
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      xp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      activeTheme: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'theme-dark',
        field: 'active_theme',
      },
      activeAvatarFrameId: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'active_avatar_frame_id',
      },
      lastLoginDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'last_login_date',
      },
      loginStreak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'login_streak',
      },
      lastDiscoveryDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'last_discovery_date',
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
    await queryInterface.dropTable('users');
  },
};
