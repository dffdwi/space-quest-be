import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { MissionModule } from '../mission/mission.module';
import { BadgeModule } from '../badge/badge.module';
import { ShopModule } from '../shop/shop.module';
import { DailyModule } from '../daily/daily.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => TaskModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => MissionModule),
    forwardRef(() => BadgeModule),
    forwardRef(() => ShopModule),
    forwardRef(() => DailyModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
