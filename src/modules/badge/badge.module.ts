import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Badge } from './badge.entity';

@Module({
  imports: [SequelizeModule.forFeature([Badge])],
  exports: [SequelizeModule],
})
export class BadgeModule {}
