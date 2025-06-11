import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mission } from './mission.entity';

@Module({
  imports: [SequelizeModule.forFeature([Mission])],
  exports: [SequelizeModule],
})
export class MissionModule {}
