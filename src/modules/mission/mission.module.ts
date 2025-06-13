import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mission } from './mission.entity';
import { PlayerMission } from './player_mission.entity';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [SequelizeModule.forFeature([Mission, PlayerMission]), BadgeModule],
  exports: [SequelizeModule],
})
export class MissionModule {}
