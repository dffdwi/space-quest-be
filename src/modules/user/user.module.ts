import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { PlayerStats } from './player_stats.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { MissionModule } from '../mission/mission.module';
import { BadgeModule } from '../badge/badge.module';
import { ShopModule } from '../shop/shop.module';
import { DailyModule } from '../daily/daily.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
@Module({
  imports: [
    SequelizeModule.forFeature([User, PlayerStats]),
    forwardRef(() => TaskModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => MissionModule),
    forwardRef(() => BadgeModule),
    forwardRef(() => ShopModule),
    forwardRef(() => DailyModule),
    forwardRef(() => LeaderboardModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
