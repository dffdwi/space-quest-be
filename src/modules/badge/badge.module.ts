import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Badge } from './badge.entity';
import { PlayerBadge } from './player_badge.entity';

@Module({
  imports: [SequelizeModule.forFeature([Badge, PlayerBadge])],
  exports: [SequelizeModule],
})
export class BadgeModule {}
