import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { PlayerBadge } from './player_badge.entity';

@Table({
  tableName: 'badges',
  timestamps: true,
})
export class Badge extends Model<Badge> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  badgeId!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.STRING)
  icon!: string;

  @Column(DataType.STRING)
  color!: string;

  @BelongsToMany(() => User, () => PlayerBadge)
  users!: User[];
}
