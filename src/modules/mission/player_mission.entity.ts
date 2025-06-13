import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Mission } from './mission.entity';

@Table({
  tableName: 'player_missions',
  timestamps: true,
})
export class PlayerMission extends Model<PlayerMission> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @PrimaryKey
  @ForeignKey(() => Mission)
  @Column(DataType.UUID)
  missionId!: string;

  @BelongsTo(() => Mission)
  mission!: Mission;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  progress!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isClaimed!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastResetDate?: Date;
}
