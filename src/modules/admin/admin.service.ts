import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { Badge } from '../badge/badge.entity';
import { PlayerBadge } from '../badge/player_badge.entity';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

const RANK_BADGE_IDS = {
  RANK_1: '6b851a93-2ee7-4387-b967-422059e0f1aa',
  RANK_2: '5316b2ff-2b7a-402b-9918-d1d6c6890e1c',
  RANK_3: '9f30ea3c-63c4-4fe8-b541-a19933a71fd8',
};
const ALL_RANK_BADGES = Object.values(RANK_BADGE_IDS);

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Badge) private readonly badgeModel: typeof Badge,
    @InjectModel(PlayerBadge)
    private readonly playerBadgeModel: typeof PlayerBadge,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  async awardBadge(userId: string, badgeId: string): Promise<PlayerBadge> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }

    const badge = await this.badgeModel.findByPk(badgeId);
    if (!badge) {
      throw new NotFoundException('Badge tidak ditemukan.');
    }

    const existingPlayerBadge = await this.playerBadgeModel.findOne({
      where: { userId, badgeId },
    });

    if (existingPlayerBadge) {
      throw new ConflictException(
        'Pengguna ini sudah memiliki lencana tersebut.',
      );
    }

    return this.playerBadgeModel.create({ userId, badgeId });
  }

  async awardLeaderboardBadges(): Promise<{ message: string; awards: any[] }> {
    const leaderboard = await this.leaderboardService.getLeaderboard();
    if (leaderboard.length === 0) {
      return {
        message: 'Leaderboard kosong, tidak ada hadiah yang dibagikan.',
        awards: [],
      };
    }

    const awards = [];

    await this.playerBadgeModel.destroy({
      where: {
        badgeId: ALL_RANK_BADGES,
      },
    });

    for (let i = 0; i < Math.min(leaderboard.length, 3); i++) {
      const user = leaderboard[i];
      const rank = i + 1;
      const badgeIdToAward = RANK_BADGE_IDS[`RANK_${rank}`];

      if (badgeIdToAward) {
        await this.playerBadgeModel.create({
          userId: user.userId,
          badgeId: badgeIdToAward,
        });
        awards.push({ rank, name: user.name, badgeId: badgeIdToAward });
      }
    }

    return {
      message: 'Lencana peringkat leaderboard berhasil dibagikan.',
      awards,
    };
  }
}
