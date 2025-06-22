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
  tableName: 'player_active_powerups',
  timestamps: true,
})
export class PlayerActivePowerUp extends Model<PlayerActivePowerUp> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  activePowerUpId!: string;

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
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Jumlah pemakaian yang tersisa',
  })
  usesLeft?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Waktu kedaluwarsa untuk power-up berbasis durasi',
  })
  expiresAt?: Date;
}
