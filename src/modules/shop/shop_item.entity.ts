import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'shop_items',
  timestamps: true,
})
export class ShopItem extends Model<ShopItem> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  itemId!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.INTEGER)
  price!: number;

  @Column(DataType.ENUM('theme', 'avatar_frame', 'power_up', 'cosmetic'))
  type!: string;

  @Column(DataType.STRING)
  value!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  icon?: string;

  @AllowNull(true)
  @Column(
    DataType.ENUM(
      'Ship Customization',
      'Commander Gear',
      'Consumables',
      'Avatars',
    ),
  )
  category?: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  duration?: number;
}
