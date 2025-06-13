import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShopItem } from './shop_item.entity';
import { PlayerInventory } from './player_inventory.entity';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ShopItem, PlayerInventory]),
    forwardRef(() => UserModule),
  ],
  providers: [ShopService],
  controllers: [ShopController],
  exports: [SequelizeModule],
})
export class ShopModule {}
