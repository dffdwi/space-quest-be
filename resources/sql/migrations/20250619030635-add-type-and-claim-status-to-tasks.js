'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tasks', 'type', {
      type: Sequelize.ENUM('personal', 'project'),
      allowNull: false,
      defaultValue: 'personal',
    });

    await queryInterface.addColumn('tasks', 'isRewardClaimed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tasks', 'type');
    await queryInterface.removeColumn('tasks', 'isRewardClaimed');
  },
};
