import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { ShopItem } from './shop_item.entity';

@Table({
  tableName: 'player_inventory',
  timestamps: true,
})
export class PlayerInventory extends Model<PlayerInventory> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  inventoryId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => ShopItem)
  @Column(DataType.UUID)
  itemId!: string;

  @BelongsTo(() => ShopItem)
  item!: ShopItem;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  acquiredAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt?: Date;
}
