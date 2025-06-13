import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameLogicService } from './game-logic.service';
import { UserModule } from '../user/user.module';
import { MissionModule } from '../mission/mission.module';
import { BadgeModule } from '../badge/badge.module';
import { Task } from '../task/task.entity';
import { PlayerMission } from '../mission/player_mission.entity';
import { PlayerBadge } from '../badge/player_badge.entity';
import { Mission } from '../mission/mission.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MissionModule,
    BadgeModule,
    SequelizeModule.forFeature([Task, PlayerMission, PlayerBadge, Mission]),
  ],
  providers: [GameLogicService],
  exports: [GameLogicService],
})
export class GameModule {}
