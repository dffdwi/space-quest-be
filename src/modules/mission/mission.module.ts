import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mission } from './mission.entity';
import { PlayerMission } from './player_mission.entity';
import { BadgeModule } from '../badge/badge.module';
import { GameModule } from '../game/game.module';
import { UserModule } from '../user/user.module';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Mission, PlayerMission]),
    BadgeModule,
    forwardRef(() => UserModule),
    forwardRef(() => GameModule),
  ],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [SequelizeModule, MissionService],
})
export class MissionModule {}
