import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { UserResponseDto } from '../user/user.contract';
import { TaskResponseDto } from '../task/task.contract';
import { Project } from './project.entity';
import { ProjectColumn } from './project_column.entity';

class ProjectMemberResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  avatarUrl?: string;

  @ApiProperty()
  role!: string;

  constructor(member: any) {
    this.userId = member.userId;
    this.name = member.name;
    this.avatarUrl = member.avatarUrl;
    this.role = member.ProjectMember.role;
  }
}

class ProjectColumnResponseDto {
  @ApiProperty()
  columnId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  order!: number;

  constructor(column: ProjectColumn) {
    this.columnId = column.columnId;
    this.title = column.title;
    this.order = column.order;
  }
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'Nama proyek atau ekspedisi',
    example: 'Expedition to Andromeda',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Deskripsi detail proyek',
    example: 'A mission to chart the outer sectors of the Andromeda galaxy.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddMemberDto {
  @ApiProperty({
    description: 'Email pengguna yang akan diundang',
    example: 'crew@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    description: 'Peran anggota dalam proyek',
    example: 'Lead Scientist',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class ProjectDetailResponseDto {
  @ApiProperty()
  projectId!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  ownerId!: string;

  @ApiProperty({ type: () => [ProjectMemberResponseDto] })
  members!: ProjectMemberResponseDto[];

  @ApiProperty({ type: () => [ProjectColumnResponseDto] })
  columns!: ProjectColumnResponseDto[];

  @ApiProperty({ type: () => [TaskResponseDto] })
  tasks!: TaskResponseDto[];

  constructor(project: Project) {
    this.projectId = project.projectId;
    this.name = project.name;
    this.description = project.description;
    this.ownerId = project.ownerId;
    this.members = project.members.map(
      (member) => new ProjectMemberResponseDto(member),
    );
    this.columns = project.columns.map(
      (column) => new ProjectColumnResponseDto(column),
    );
    this.tasks = project.tasks.map((task) => new TaskResponseDto(task));
  }
}
