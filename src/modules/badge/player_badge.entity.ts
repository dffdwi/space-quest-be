import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Badge } from './badge.entity';

@Table({
  tableName: 'player_badges',
  timestamps: true,
})
export class PlayerBadge extends Model<PlayerBadge> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @PrimaryKey
  @ForeignKey(() => Badge)
  @Column(DataType.UUID)
  badgeId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  earnedAt!: Date;
}
