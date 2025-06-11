import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShopItem } from './shop_item.entity';

@Module({
  imports: [SequelizeModule.forFeature([ShopItem])],
  exports: [SequelizeModule],
})
export class ShopModule {}
