import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './user.contract';
import { User } from './user.entity';
import { PlayerStats } from './player_stats.entity';
import { Op } from 'sequelize';
import { Badge } from '../badge/badge.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
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
      ],
    });
    if (!user) {
      throw new NotFoundException(`User dengan ID ${userId} tidak ditemukan`);
    }
    return user;
  }
}
