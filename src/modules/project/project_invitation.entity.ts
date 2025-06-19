import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Project } from './project.entity';

@Table({
  tableName: 'project_invitations',
  timestamps: true,
})
export class ProjectInvitation extends Model<ProjectInvitation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  invitationId!: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  projectId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  inviterId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  inviteeId!: string;

  @Default('Crew Member')
  @Column(DataType.STRING)
  role!: string;

  @Default('PENDING')
  @Column(DataType.ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED'))
  status!: string;

  @BelongsTo(() => Project)
  project!: Project;

  @BelongsTo(() => User, 'inviterId')
  inviter!: User;

  @BelongsTo(() => User, 'inviteeId')
  invitee!: User;
}
