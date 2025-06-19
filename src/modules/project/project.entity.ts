import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { ProjectColumn } from './project_column.entity';
import { ProjectMember } from './project_member.entity';
import { ProjectInvitation } from './project_invitation.entity';

@Table({
  tableName: 'projects',
  timestamps: true,
})
export class Project extends Model<Project> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  projectId!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  ownerId!: string;

  @BelongsTo(() => User, 'ownerId')
  owner!: User;

  @HasMany(() => Task)
  tasks!: Task[];

  @HasMany(() => ProjectColumn)
  columns!: ProjectColumn[];

  @BelongsToMany(() => User, () => ProjectMember)
  members!: User[];

  @HasMany(() => ProjectInvitation)
  invitations!: ProjectInvitation[];
}
