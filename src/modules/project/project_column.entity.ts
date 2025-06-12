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
import { Project } from './project.entity';

@Table({
  tableName: 'project_columns',
  timestamps: true,
})
export class ProjectColumn extends Model<ProjectColumn> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  columnId!: string;

  @ForeignKey(() => Project)
  @Column(DataType.UUID)
  projectId!: string;

  @BelongsTo(() => Project)
  project!: Project;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.INTEGER)
  order!: number;
}
