'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const badgeIds = {
      FIRST_CONTACT: 'c8f9af97-bef2-4a0d-8962-91711370a9df',
      EXPLORER_INITIATE: 'aff831c5-37f1-47cd-be47-0c38cc4c6893',
      DILIGENT_COMMANDER: '5b6e40ce-1d8a-4b2f-a525-6a3b7966be38',
      LEVEL_5_CADET: '9bca3149-b4c6-457b-8d17-41299dbf1a63',
    };

    const missionIds = {
      COMPLETE_1_TASK: '1af9bca1-7493-4676-b56d-88f28c01608e',
      COMPLETE_5_TASKS: '138af36a-8954-47a4-a171-d6e6b812b8d2',
      REACH_LEVEL_5: '8eea9fb6-ddf2-4d4b-9a4b-b501ab89c243',
    };

    await queryInterface.bulkInsert('badges', [
      {
        badgeId: badgeIds.FIRST_CONTACT,
        name: 'First Contact',
        description: 'Complete your first mission log.',
        icon: 'FaRegLightbulb',
        color: 'text-yellow-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeIds.EXPLORER_INITIATE,
        name: 'Explorer Initiate',
        description: 'Complete 5 mission logs.',
        icon: 'FaSpaceShuttle',
        color: 'text-sky-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeIds.DILIGENT_COMMANDER,
        name: 'Diligent Commander',
        description: 'Complete 20 mission logs.',
        icon: 'FaUserAstronaut',
        color: 'text-purple-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeIds.LEVEL_5_CADET,
        name: 'Cadet Level 5',
        description: 'Reach Command Level 5.',
        icon: 'FaGraduationCap',
        color: 'text-indigo-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('missions', [
      {
        missionId: missionIds.COMPLETE_1_TASK,
        title: 'The First Step',
        description: 'Complete your very first objective.',
        type: 'once',
        target: 1,
        rewardXp: 25,
        rewardCredits: 10,
        rewardBadgeId: badgeIds.FIRST_CONTACT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        missionId: missionIds.COMPLETE_5_TASKS,
        title: 'Getting the Hang of It',
        description: 'Complete a total of 5 objectives.',
        type: 'once',
        target: 5,
        rewardXp: 50,
        rewardCredits: 20,
        rewardBadgeId: badgeIds.EXPLORER_INITIATE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        missionId: missionIds.REACH_LEVEL_5,
        title: 'A Commander in the Making',
        description: 'Reach Level 5 and prove your capabilities.',
        type: 'once',
        target: 5,
        rewardXp: 200,
        rewardCredits: 100,
        rewardBadgeId: badgeIds.LEVEL_5_CADET,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('shop_items', [
      {
        itemId: uuidv4(),
        name: 'Nebula Dark Theme',
        description: 'A sleek, dark interface with vibrant nebula accents.',
        price: 250,
        type: 'theme',
        value: 'theme-nebula-dark',
        icon: 'FaPalette',
        category: 'Ship Customization',
        duration: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        name: 'Gold Commander Frame',
        description: 'A prestigious gold frame for your commander avatar.',
        price: 150,
        type: 'avatar_frame',
        value: 'gold-commander-frame',
        icon: 'FaStar',
        category: 'Commander Gear',
        duration: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        name: 'XP Hyper-Boost (Small)',
        description: 'Doubles XP gained from the next 3 completed objectives.',
        price: 75,
        type: 'power_up',
        value: 'xp_boost_small',
        icon: 'FaFlask',
        category: 'Consumables',
        duration: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemId: uuidv4(),
        name: 'Starfield Light Theme',
        description:
          'A bright and clear interface, like gazing upon a field of distant stars.',
        price: 200,
        type: 'theme',
        value: 'theme-starfield-light',
        icon: 'FaPalette',
        category: 'Ship Customization',
        duration: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shop_items', null, {});
    await queryInterface.bulkDelete('missions', null, {});
    await queryInterface.bulkDelete('badges', null, {});
  },
};
