'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatarUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'level', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
    await queryInterface.addColumn('users', 'xp', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('users', 'credits', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 100,
    });
    await queryInterface.addColumn('users', 'activeTheme', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'theme-dark',
    });
    await queryInterface.addColumn('users', 'activeAvatarFrameId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'lastLoginDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'loginStreak', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('users', 'lastDiscoveryDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatarUrl');
    await queryInterface.removeColumn('users', 'level');
    await queryInterface.removeColumn('users', 'xp');
    await queryInterface.removeColumn('users', 'credits');
    await queryInterface.removeColumn('users', 'activeTheme');
    await queryInterface.removeColumn('users', 'activeAvatarFrameId');
    await queryInterface.removeColumn('users', 'lastLoginDate');
    await queryInterface.removeColumn('users', 'loginStreak');
    await queryInterface.removeColumn('users', 'lastDiscoveryDate');
  },
};
