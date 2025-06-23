import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'player_stats', timestamps: true })
export class PlayerStats extends Model<PlayerStats> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  userId!: string;

  @Default(0)
  @Column(DataType.INTEGER)
  tasksCompleted!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  totalXpEarned!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  totalCreditsEarned!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  longestMissionStreak!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    comment: 'XP harian yang sudah didapat dari tugas personal',
  })
  dailyPersonalXpGained!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    comment: 'CP harian yang sudah didapat dari tugas personal',
  })
  dailyPersonalCpGained!: number;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Tanggal terakhir menyelesaikan tugas personal',
  })
  lastPersonalTaskCompletionDate?: Date;

  @BelongsTo(() => User)
  user!: User;
}
