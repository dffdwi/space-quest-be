import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Mission } from './mission.entity';
import { PlayerMission } from './player_mission.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectModel(PlayerMission)
    private readonly playerMissionModel: typeof PlayerMission,
  ) {}

  async getPlayerMissionProgress(userId: string): Promise<any[]> {
    const playerMissions = await this.playerMissionModel.findAll({
      where: { userId },
      include: [{ model: Mission, as: 'mission' }],
    });

    if (!playerMissions) {
      return [];
    }

    return playerMissions.map((pm) => {
      const playerMissionObject = pm.toJSON();

      return {
        missionId: playerMissionObject.mission.missionId,
        title: playerMissionObject.mission.title,
        description: playerMissionObject.mission.description,
        target: playerMissionObject.mission.target,
        type: playerMissionObject.mission.type,
        rewardXp: playerMissionObject.mission.rewardXp,
        rewardCredits: playerMissionObject.mission.rewardCredits,
        rewardBadgeId: playerMissionObject.mission.rewardBadgeId,
        currentProgress: playerMissionObject.progress,
        isClaimed: playerMissionObject.isClaimed,
        lastResetDate: playerMissionObject.lastResetDate,
      };
    });
  }

  async claimReward(userId: string, missionId: string) {
    const playerMission = await this.playerMissionModel.findOne({
      where: { userId, missionId },
      include: [Mission],
    });

    if (!playerMission) {
      throw new NotFoundException('Progres misi tidak ditemukan.');
    }
    if (playerMission.isClaimed) {
      throw new BadRequestException('Hadiah sudah diklaim.');
    }
    if (playerMission.progress < playerMission.mission.target) {
      throw new BadRequestException('Misi belum selesai.');
    }

    playerMission.isClaimed = true;
    await playerMission.save();

    return playerMission;
  }
}
