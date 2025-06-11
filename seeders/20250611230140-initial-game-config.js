'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const badgeFirstContact = uuidv4();
    const badgeExplorerInitiate = uuidv4();
    const badgeDiligentCommander = uuidv4();
    const badgeGalacticWorkhorse = uuidv4();
    const badgeLevel5Cadet = uuidv4();
    const badgeSeasonedCaptain = uuidv4();
    const badgeDedicatedNavigator = uuidv4();
    const badgeProjectInitiator = uuidv4();
    const badgeStarMarketPatron = uuidv4();

    await queryInterface.bulkInsert('badges', [
      {
        badgeId: badgeFirstContact,
        name: 'First Contact',
        description: 'Complete your first mission log.',
        icon: 'FaRegLightbulb',
        color: 'text-yellow-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeExplorerInitiate,
        name: 'Explorer Initiate',
        description: 'Complete 5 mission logs.',
        icon: 'FaSpaceShuttle',
        color: 'text-sky-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeDiligentCommander,
        name: 'Diligent Commander',
        description: 'Complete 20 mission logs.',
        icon: 'FaUserAstronaut',
        color: 'text-purple-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeGalacticWorkhorse,
        name: 'Galactic Workhorse',
        description: 'Complete 100 mission logs.',
        icon: 'FaMedal',
        color: 'text-orange-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeLevel5Cadet,
        name: 'Cadet Level 5',
        description: 'Reach Command Level 5.',
        icon: 'FaGraduationCap',
        color: 'text-indigo-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeSeasonedCaptain,
        name: 'Seasoned Captain',
        description: 'Reach Command Level 10.',
        icon: 'FaShieldAlt',
        color: 'text-green-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeDedicatedNavigator,
        name: 'Dedicated Navigator (7 Days)',
        description: 'Log in 7 days in a row.',
        icon: 'FaCalendarCheck',
        color: 'text-teal-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeProjectInitiator,
        name: 'Expedition Planner',
        description: 'Create your first Crew Expedition.',
        icon: 'FaUsersCog',
        color: 'text-rose-400',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        badgeId: badgeStarMarketPatron,
        name: 'Star Market Patron',
        description: 'Make your first purchase at the Star Market.',
        icon: 'FaStore',
        color: 'text-amber-500',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('missions', [
      {
        missionId: uuidv4(),
        title: 'Daily Patrol',
        description: 'Clear at least one personal objective today.',
        type: 'daily',
        target: 1,
        rewardXp: 15,
        rewardCredits: 5,
        rewardBadgeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        missionId: uuidv4(),
        title: 'Weekly Sector Scan',
        description:
          'Complete 7 personal objectives this week to map the area.',
        type: 'weekly',
        target: 7,
        rewardXp: 150,
        rewardCredits: 50,
        rewardBadgeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        missionId: uuidv4(),
        title: 'The First Step',
        description: 'Complete your very first objective.',
        type: 'once',
        target: 1,
        rewardXp: 25,
        rewardCredits: 10,
        rewardBadgeId: badgeFirstContact,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        missionId: uuidv4(),
        title: 'Getting the Hang of It',
        description: 'Complete a total of 5 objectives.',
        type: 'once',
        target: 5,
        rewardXp: 50,
        rewardCredits: 20,
        rewardBadgeId: badgeExplorerInitiate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        missionId: uuidv4(),
        title: 'A Commander in the Making',
        description: 'Reach Level 5 and prove your capabilities.',
        type: 'once',
        target: 5,
        rewardXp: 200,
        rewardCredits: 100,
        rewardBadgeId: badgeLevel5Cadet,
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
