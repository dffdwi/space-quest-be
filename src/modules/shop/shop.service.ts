import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { ShopItem } from './shop_item.entity';
import { PlayerInventory } from './player_inventory.entity';
import { Sequelize } from 'sequelize-typescript';
import { PlayerActivePowerUp } from './player_active_powerup.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(ShopItem)
    private readonly shopItemModel: typeof ShopItem,
    @InjectModel(PlayerInventory)
    private readonly playerInventoryModel: typeof PlayerInventory,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(PlayerActivePowerUp)
    private readonly playerActivePowerUpModel: typeof PlayerActivePowerUp,
    private sequelize: Sequelize,
  ) {}

  async purchaseItem(
    userId: string,
    itemId: string,
  ): Promise<PlayerInventory | PlayerActivePowerUp> {
    const item = await this.shopItemModel.findByPk(itemId);
    if (!item) {
      throw new NotFoundException('Item tidak ditemukan di toko.');
    }

    const user = await this.userModel.findByPk(userId);
    if (user.credits < item.price) {
      throw new BadRequestException('Kredit tidak mencukupi.');
    }

    return await this.sequelize.transaction(async (tx) => {
      user.credits -= item.price;
      await user.save({ transaction: tx });

      if (item.type === 'power_up') {
        return this.playerActivePowerUpModel.create(
          {
            userId,
            itemId,
            usesLeft: item.duration,
          },
          { transaction: tx },
        );
      } else {
        return this.playerInventoryModel.create(
          {
            userId,
            itemId,
          },
          { transaction: tx },
        );
      }
    });
  }
}
