import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { Mission } from '../mission/mission.entity';
import { PlayerMission } from '../mission/player_mission.entity';
import { PlayerBadge } from '../badge/player_badge.entity';
import { Badge } from '../badge/badge.entity';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Task } from '../task/task.entity';
import { PlayerActivePowerUp } from '../shop/player_active_powerup.entity';
import { ShopItem } from '../shop/shop_item.entity';
import { PlayerStats } from '../user/player_stats.entity';

export const XP_PER_LEVEL = [
  0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100, 5000,
];

export interface GameEventResult {
  leveledUp?: { from: number; to: number };
  badgesEarned?: Badge[];
  missionsReadyToClaim?: Mission[];
  powerUpConsumed?: { name: string };
}

const STATIC_BADGE_IDS = {
  FIRST_CONTACT: 'c8f9af97-bef2-4a0d-8962-91711370a9df',
  EXPLORER_INITIATE: 'aff831c5-37f1-47cd-be47-0c38cc4c6893',
  DILIGENT_COMMANDER: '5b6e40ce-1d8a-4b2f-a525-6a3b7966be38',
  LEVEL_5_CADET: '9bca3149-b4c6-457b-8d17-41299dbf1a63',
};

const STATIC_MISSION_IDS = {
  COMPLETE_1_TASK: '1af9bca1-7493-4676-b56d-88f28c01608e',
  COMPLETE_5_TASKS: '138af36a-8954-47a4-a171-d6e6b812b8d2',
  REACH_LEVEL_5: '8eea9fb6-ddf2-4d4b-9a4b-b501ab89c243',
};

const DAILY_PERSONAL_XP_CAP = 20;
const DAILY_PERSONAL_CP_CAP = 20;

const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

@Injectable()
export class GameLogicService {
  private readonly logger = new Logger(GameLogicService.name);

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(PlayerMission)
    private readonly playerMissionModel: typeof PlayerMission,
    @InjectModel(PlayerBadge)
    private readonly playerBadgeModel: typeof PlayerBadge,
    @InjectModel(Mission) private readonly missionModel: typeof Mission,
    @InjectModel(Badge) private readonly badgeModel: typeof Badge,
    @InjectModel(PlayerActivePowerUp)
    private readonly playerActivePowerUpModel: typeof PlayerActivePowerUp,
    private sequelize: Sequelize,
  ) {}

  private async checkAndAwardBadges(
    user: User,
    completedTasksCount: number,
    transaction: any,
  ): Promise<Badge[]> {
    const earnedBadges: Badge[] = [];

    const playerBadges = await this.playerBadgeModel.findAll({
      where: { userId: user.userId },
      transaction,
    });
    const playerBadgeIds = new Set(playerBadges.map((pb) => pb.badgeId));

    const checkAndAward = async (
      badgeId: string,
      condition: boolean,
      badgeData?: Badge,
    ) => {
      if (condition && !playerBadgeIds.has(badgeId)) {
        await this.playerBadgeModel.create(
          { userId: user.userId, badgeId },
          { transaction },
        );
        const badge =
          badgeData ||
          (await this.badgeModel.findByPk(badgeId, { transaction }));
        if (badge) earnedBadges.push(badge);
      }
    };

    await checkAndAward(
      STATIC_BADGE_IDS.FIRST_CONTACT,
      completedTasksCount >= 1,
    );
    await checkAndAward(
      STATIC_BADGE_IDS.EXPLORER_INITIATE,
      completedTasksCount >= 5,
    );
    await checkAndAward(
      STATIC_BADGE_IDS.DILIGENT_COMMANDER,
      completedTasksCount >= 20,
    );
    await checkAndAward(STATIC_BADGE_IDS.LEVEL_5_CADET, user.level >= 5);

    return earnedBadges;
  }

  private async updateMissionProgress(
    user: User,
    completedTasksCount: number,
    transaction: any,
  ): Promise<Mission[]> {
    const missionsReady: Mission[] = [];

    const checkAndUpdate = async (
      missionId: string,
      currentProgress: number,
    ) => {
      let playerMission = await this.playerMissionModel.findOne({
        where: { userId: user.userId, missionId },
        include: [Mission],
        transaction,
      });
      if (!playerMission) {
        playerMission = await this.playerMissionModel.create(
          { userId: user.userId, missionId, progress: 0 },
          { transaction },
        );
        playerMission.mission = await this.missionModel.findByPk(missionId, {
          transaction,
        });
      }

      if (!playerMission.isClaimed) {
        playerMission.progress = currentProgress;
        await playerMission.save({ transaction });

        if (playerMission.progress >= playerMission.mission.target) {
          missionsReady.push(playerMission.mission);
        }
      }
    };

    await checkAndUpdate(
      STATIC_MISSION_IDS.COMPLETE_1_TASK,
      completedTasksCount,
    );
    await checkAndUpdate(
      STATIC_MISSION_IDS.COMPLETE_5_TASKS,
      completedTasksCount,
    );
    await checkAndUpdate(STATIC_MISSION_IDS.REACH_LEVEL_5, user.level);

    return missionsReady;
  }

  async processTaskCompletion(
    userId: string,
    taskXP: number,
    taskCredits: number,
    taskType: 'personal' | 'project',
  ): Promise<GameEventResult> {
    const result: GameEventResult = {
      badgesEarned: [],
      missionsReadyToClaim: [],
    };

    return await this.sequelize.transaction(async (tx) => {
      const transactionHost = { transaction: tx };

      // 1. Ambil dan kunci user & stats secara terpisah untuk menghindari error
      const user = await this.userModel.findByPk(userId, {
        ...transactionHost,
        lock: tx.LOCK.UPDATE,
      });
      if (!user) {
        throw new Error(`User dengan ID ${userId} tidak ditemukan`);
      }

      let stats = await PlayerStats.findOne({
        where: { userId },
        ...transactionHost,
        lock: tx.LOCK.UPDATE,
      });

      if (!stats) {
        stats = await PlayerStats.create({ userId }, transactionHost);
      }

      let xpToAdd = taskXP;
      let cpToAdd = taskCredits;

      // 2. LOGIKA POWER-UP
      const xpBoostPowerUp = await this.playerActivePowerUpModel.findOne({
        where: { userId },
        include: [
          {
            model: ShopItem,
            where: { value: { [Op.like]: '%xp_boost%' } },
          },
        ],
        ...transactionHost,
      });

      if (xpBoostPowerUp) {
        xpToAdd *= 2;
        result.powerUpConsumed = { name: xpBoostPowerUp.item.name };
        if (xpBoostPowerUp.usesLeft !== null) {
          xpBoostPowerUp.usesLeft -= 1;
        }
        if (xpBoostPowerUp.usesLeft !== null && xpBoostPowerUp.usesLeft <= 0) {
          await xpBoostPowerUp.destroy({ transaction: tx });
        } else {
          await xpBoostPowerUp.save(transactionHost);
        }
      }

      // 3. LOGIKA BATAS HARIAN (HANYA UNTUK TUGAS PERSONAL)
      if (taskType === 'personal') {
        const today = new Date();
        if (!isSameDay(stats.lastPersonalTaskCompletionDate, today)) {
          stats.dailyPersonalXpGained = 0;
          stats.dailyPersonalCpGained = 0;
        }

        const remainingXpCap =
          DAILY_PERSONAL_XP_CAP - stats.dailyPersonalXpGained;
        const remainingCpCap =
          DAILY_PERSONAL_CP_CAP - stats.dailyPersonalCpGained;

        const cappedXp = Math.max(0, Math.min(xpToAdd, remainingXpCap));
        const cappedCp = Math.max(0, Math.min(cpToAdd, remainingCpCap));

        stats.dailyPersonalXpGained += cappedXp;
        stats.dailyPersonalCpGained += cappedCp;
        stats.lastPersonalTaskCompletionDate = today;

        xpToAdd = cappedXp;
        cpToAdd = cappedCp;
      }

      // 4. UPDATE STATISTIK & PENGGUNA
      user.xp += xpToAdd;
      user.credits += cpToAdd;

      stats.tasksCompleted += 1;
      stats.totalXpEarned += xpToAdd;
      stats.totalCreditsEarned += cpToAdd;

      const originalLevel = user.level;
      let newLevel = user.level;
      while (
        newLevel < XP_PER_LEVEL.length &&
        user.xp >= XP_PER_LEVEL[newLevel]
      ) {
        newLevel++;
      }
      if (newLevel > originalLevel) {
        user.level = newLevel;
        result.leveledUp = { from: originalLevel, to: newLevel };
      }

      await user.save(transactionHost);
      await stats.save(transactionHost);

      // 5. LOGIKA MISI & LENCANA
      const completedTasksCount = stats.tasksCompleted;
      result.missionsReadyToClaim = await this.updateMissionProgress(
        user,
        completedTasksCount,
        tx,
      );
      result.badgesEarned = await this.checkAndAwardBadges(
        user,
        completedTasksCount,
        tx,
      );

      return result;
    });
  }

  async processMissionClaim(
    userId: string,
    mission: Mission,
  ): Promise<GameEventResult> {
    const result: GameEventResult = {
      badgesEarned: [],
      missionsReadyToClaim: [],
    };

    return await this.sequelize.transaction(async (tx) => {
      const user = await this.userModel.findByPk(userId, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });
      if (!user) throw new Error('User not found');

      user.xp += mission.rewardXp;
      user.credits += mission.rewardCredits;

      const originalLevel = user.level;
      let newLevel = user.level;
      while (
        newLevel < XP_PER_LEVEL.length &&
        user.xp >= XP_PER_LEVEL[newLevel]
      ) {
        newLevel++;
      }
      if (newLevel > originalLevel) {
        user.level = newLevel;
        result.leveledUp = { from: originalLevel, to: newLevel };
      }

      if (mission.rewardBadgeId) {
        const hasBadge = await this.playerBadgeModel.findOne({
          where: { userId, badgeId: mission.rewardBadgeId },
          transaction: tx,
        });
        if (!hasBadge) {
          await this.playerBadgeModel.create(
            { userId, badgeId: mission.rewardBadgeId },
            { transaction: tx },
          );
          const badge = await this.badgeModel.findByPk(mission.rewardBadgeId, {
            transaction: tx,
          });
          if (badge) {
            result.badgesEarned.push(badge);
          }
        }
      }

      await user.save({ transaction: tx });
      return result;
    });
  }
}
