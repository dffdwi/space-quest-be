import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Project } from './project.entity';

@Table({
  tableName: 'project_members',
  timestamps: true,
})
export class ProjectMember extends Model<ProjectMember> {
  @PrimaryKey
  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  projectId!: string;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.STRING)
  role!: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  projectXp!: number;
}
