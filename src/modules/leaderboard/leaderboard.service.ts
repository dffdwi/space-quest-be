import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async getLeaderboard() {
    return this.userModel.findAll({
      attributes: ['userId', 'name', 'avatarUrl', 'level', 'xp'],
      order: [
        ['xp', 'DESC'],
        ['level', 'DESC'],
      ],
      limit: 10,
    });
  }
}
