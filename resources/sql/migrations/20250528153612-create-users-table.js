// db/migrations/YYYYMMDDHHMMSS-create-users-table.js (atau path yang sesuai)
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      name: {
        type: Sequelize.STRING,
        allowNull: true, // Sesuai dengan User entity Anda
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Otomatis diisi oleh DB
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Otomatis diisi dan diupdate oleh DB
      },
      // Jika Anda memiliki kolom lain seperti 'deletedAt' untuk soft delete, tambahkan di sini
      // deletedAt: {
      //   type: Sequelize.DATE,
      //   allowNull: true,
      // },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
