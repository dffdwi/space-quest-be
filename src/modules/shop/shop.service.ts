import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { ShopItem } from './shop_item.entity';
import { PlayerInventory } from './player_inventory.entity';
import { Sequelize } from 'sequelize-typescript';
import { PlayerActivePowerUp } from './player_active_powerup.entity';
import { PlayerBadge } from '../badge/player_badge.entity';

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
    @InjectModel(PlayerBadge)
    private readonly playerBadgeModel: typeof PlayerBadge,
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
  async redeemVoucher(
    userId: string,
    itemId: string,
  ): Promise<{ success: boolean; message: string }> {
    const itemToRedeem = await this.shopItemModel.findByPk(itemId);

    if (!itemToRedeem) {
      throw new NotFoundException('Item voucher tidak ditemukan.');
    }
    if (itemToRedeem.type !== 'voucher' || !itemToRedeem.requiredBadgeId) {
      throw new BadRequestException(
        'Item ini bukan voucher yang bisa ditukarkan.',
      );
    }

    const existingVoucher = await this.playerInventoryModel.findOne({
      where: { userId, itemId },
    });
    if (existingVoucher) {
      throw new ConflictException(
        'Anda sudah menukarkan voucher ini sebelumnya.',
      );
    }

    const requiredBadge = await this.playerBadgeModel.findOne({
      where: {
        userId,
        badgeId: itemToRedeem.requiredBadgeId,
      },
    });

    if (!requiredBadge) {
      throw new ForbiddenException(
        'Anda tidak memiliki lencana yang dibutuhkan untuk menukarkan voucher ini.',
      );
    }

    const t = await this.sequelize.transaction();
    try {
      await requiredBadge.destroy({ transaction: t });

      await this.playerInventoryModel.create(
        {
          userId,
          itemId,
        },
        { transaction: t },
      );

      await t.commit();
      return {
        success: true,
        message: `Voucher ${itemToRedeem.name} berhasil ditukarkan!`,
      };
    } catch (error) {
      await t.rollback();
      console.error('Gagal menukarkan voucher:', error);
      throw new Error('Terjadi kesalahan saat proses penukaran.');
    }
  }
}
