import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'player_stats', timestamps: true })
export class PlayerStats extends Model<PlayerStats> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  userId!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  tasksCompleted!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalXpEarned!: number;

  @BelongsTo(() => User)
  user!: User;
}
