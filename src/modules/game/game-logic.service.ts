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

export const XP_PER_LEVEL = [
  0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100, 5000,
];

export interface GameEventResult {
  leveledUp?: { from: number; to: number };
  badgesEarned?: Badge[];
  missionsReadyToClaim?: Mission[];
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
  ): Promise<GameEventResult> {
    const result: GameEventResult = {
      badgesEarned: [],
      missionsReadyToClaim: [],
    };

    return await this.sequelize.transaction(async (tx) => {
      try {
        const user = await this.userModel.findByPk(userId, {
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });
        if (!user) throw new Error('User not found');

        const originalLevel = user.level;
        user.xp += taskXP;
        user.credits += taskCredits;

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
        await user.save({ transaction: tx });

        const completedTasksCount = await this.taskModel.count({
          where: { userId: user.userId, completed: true },
          transaction: tx,
        });

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
      } catch (error) {
        this.logger.error('Gagal memproses penyelesaian tugas', error.stack);
        throw error;
      }
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
