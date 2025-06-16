import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './user.contract';
import { User } from './user.entity';
import { PlayerStats } from './player_stats.entity';
import { Op, Sequelize } from 'sequelize';
import { Badge } from '../badge/badge.entity';
import { PlayerMission } from '../mission/player_mission.entity';
import { PlayerBadge } from '../badge/player_badge.entity';
import { PlayerInventory } from '../shop/player_inventory.entity';
import { Task } from '../task/task.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    // private readonly sequelize: Sequelize,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }
    const user = await this.userModel.create({ ...createUserDto });
    await PlayerStats.create({ userId: user.userId });
    return user;
  }

  async findAll(query: string): Promise<User[]> {
    if (!query) {
      return this.userModel.findAll({
        limit: 10,
        attributes: ['userId', 'name', 'email', 'avatarUrl'],
      });
    }
    return this.userModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: 10,
      attributes: ['userId', 'name', 'email', 'avatarUrl'],
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId, {
      include: [
        PlayerStats,
        {
          model: Badge,
          through: { attributes: [] },
        },
        {
          model: PlayerInventory,
          as: 'inventory',
          attributes: ['itemId'],
        },
      ],
    });
    if (!user) {
      throw new NotFoundException(`User dengan ID ${userId} tidak ditemukan`);
    }
    return user;
  }

  async resetProgress(userId: string): Promise<User> {
    const user = await this.findById(userId);

    const sequelize = this.userModel.sequelize;
    if (!sequelize) {
      throw new Error('Sequelize instance not found');
    }

    await sequelize.transaction(async (t) => {
      await PlayerMission.destroy({ where: { userId }, transaction: t });
      await PlayerBadge.destroy({ where: { userId }, transaction: t });
      await PlayerInventory.destroy({ where: { userId }, transaction: t });
      await Task.destroy({ where: { userId }, transaction: t });

      const stats = await PlayerStats.findOne({
        where: { userId },
        transaction: t,
      });
      if (stats) {
        await stats.update(
          {
            tasksCompleted: 0,
            totalXpEarned: 0,
            totalCreditsEarned: 100,
            longestMissionStreak: stats.longestMissionStreak,
          },
          { transaction: t },
        );
      } else {
        await PlayerStats.create({ userId }, { transaction: t });
      }

      await user.update(
        {
          level: 1,
          xp: 0,
          credits: 100,
          lastLoginDate: null,
          loginStreak: 0,
          lastDiscoveryDate: null,
        },
        { transaction: t },
      );
    });

    return this.findById(userId);
  }

  async applyTheme(userId: string, themeValue: string): Promise<User> {
    const user = await this.findById(userId);

    user.activeTheme = themeValue;
    await user.save();
    return user;
  }

  async applyAvatarFrame(
    userId: string,
    frameValue: string | null,
  ): Promise<User> {
    const user = await this.findById(userId);

    user.activeAvatarFrameId = frameValue;
    await user.save();
    return user;
  }
}
