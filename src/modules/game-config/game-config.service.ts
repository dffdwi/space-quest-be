import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Badge } from '../badge/badge.entity';
import { Mission } from '../mission/mission.entity';
import { ShopItem } from '../shop/shop_item.entity';

@Injectable()
export class GameConfigService {
  constructor(
    @InjectModel(Badge)
    private readonly badgeModel: typeof Badge,
    @InjectModel(Mission)
    private readonly missionModel: typeof Mission,
    @InjectModel(ShopItem)
    private readonly shopItemModel: typeof ShopItem,
  ) {}

  async getAllGameConfig() {
    const badges = await this.badgeModel.findAll();
    const missions = await this.missionModel.findAll();
    const shopItems = await this.shopItemModel.findAll();

    return {
      badges,
      missions,
      shopItems,
    };
  }
}
