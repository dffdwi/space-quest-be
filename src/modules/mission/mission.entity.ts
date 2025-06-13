import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Badge } from '../badge/badge.entity';
import { User } from '../user/user.entity';
import { PlayerMission } from './player_mission.entity';

@Table({
  tableName: 'missions',
  timestamps: true,
})
export class Mission extends Model<Mission> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  missionId!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.ENUM('once', 'daily', 'weekly'))
  type!: string;

  @Column(DataType.INTEGER)
  target!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  rewardXp!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  rewardCredits!: number;

  @ForeignKey(() => Badge)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  rewardBadgeId?: string;

  @BelongsTo(() => Badge)
  rewardBadge?: Badge;

  @BelongsToMany(() => User, () => PlayerMission)
  players!: User[];

  @HasMany(() => PlayerMission)
  playerMissions!: PlayerMission[];
}
