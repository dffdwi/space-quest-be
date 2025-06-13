import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShopItem } from './shop_item.entity';
import { PlayerInventory } from './player_inventory.entity';

@Module({
  imports: [SequelizeModule.forFeature([ShopItem, PlayerInventory])],
  exports: [SequelizeModule],
})
export class ShopModule {}
