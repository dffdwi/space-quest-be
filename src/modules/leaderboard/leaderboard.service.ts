import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { Badge } from '../badge/badge.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async getLeaderboard() {
    return this.userModel.findAll({
      attributes: ['userId', 'name', 'avatarUrl', 'level', 'xp', 'loginStreak'],
      include: [
        {
          model: Badge,
          as: 'badges',
          attributes: ['badgeId', 'name', 'icon', 'color'],
          through: { attributes: [] },
        },
      ],
      order: [
        ['xp', 'DESC'],
        ['level', 'DESC'],
      ],
      limit: 10,
    });
  }
}
