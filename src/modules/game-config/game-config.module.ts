import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Badge } from '../badge/badge.entity';
import { ShopItem } from '../shop/shop_item.entity';
import { Mission } from '../mission/mission.entity';
import { GameConfigService } from './game-config.service';
import { GameConfigController } from './game-config.controller';

@Module({
  imports: [SequelizeModule.forFeature([Badge, ShopItem, Mission])],
  providers: [GameConfigService],
  controllers: [GameConfigController],
})
export class GameConfigModule {}
