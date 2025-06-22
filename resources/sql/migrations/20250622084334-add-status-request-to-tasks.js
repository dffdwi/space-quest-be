'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tasks', 'statusChangeRequest', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Menyimpan ID kolom tujuan yang diminta oleh anggota.',
    });

    await queryInterface.addColumn('tasks', 'statusChangeRequesterId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'userId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('tasks', 'statusChangeMessage', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Pesan opsional dari pemohon.',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tasks', 'statusChangeRequest');
    await queryInterface.removeColumn('tasks', 'statusChangeRequesterId');
    await queryInterface.removeColumn('tasks', 'statusChangeMessage');
  },
};
