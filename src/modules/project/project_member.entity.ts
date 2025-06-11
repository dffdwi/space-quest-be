import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
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

  @Column(DataType.STRING)
  role!: string;
}
