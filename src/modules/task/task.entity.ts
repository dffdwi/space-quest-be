import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model<Task> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  taskId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'The user this task is assigned to (the owner)',
  })
  userId!: string;

  @BelongsTo(() => User, 'userId')
  owner!: User;

  @ForeignKey(() => Project)
  @AllowNull(true)
  @Column(DataType.UUID)
  projectId?: string;

  @BelongsTo(() => Project)
  project?: Project;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    comment: 'The user who created this task',
  })
  createdBy!: string;

  @BelongsTo(() => User, 'createdBy')
  creator!: User;

  @Column(DataType.STRING)
  title!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @Default('todo')
  @Column(DataType.STRING)
  status!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  category?: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  dueDate?: Date;

  @Default(10)
  @Column(DataType.INTEGER)
  xp!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  credits!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  completed!: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  completedAt?: Date;

  @Default('personal')
  @Column(DataType.ENUM('personal', 'project'))
  type!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isRewardClaimed!: boolean;
}
