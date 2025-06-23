'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('project_members', 'projectXp', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'XP yang didapat oleh user khusus di dalam proyek ini.',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('project_members', 'projectXp');
  },
};
