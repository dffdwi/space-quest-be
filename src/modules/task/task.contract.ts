import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { Task } from './task.entity';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Judul tugas',
    example: 'Refuel the starship',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    description: 'Deskripsi detail tugas',
    example: 'Go to the fueling station on Sector 7.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tanggal jatuh tempo',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Kategori tugas',
    example: 'Maintenance',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'XP yang didapat dari tugas ini',
    example: 25,
  })
  @IsOptional()
  @IsInt()
  xp?: number;

  @ApiPropertyOptional({
    description: 'Kredit yang didapat dari tugas ini',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  credits?: number;

  @ApiPropertyOptional({
    description: 'ID proyek jika tugas ini bagian dari proyek',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    description:
      'ID pengguna yang akan mengerjakan tugas ini. Jika kosong, akan diisi oleh pembuat tugas.',
  })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Status tugas/kolom kanban' })
  @IsOptional()
  @IsString()
  status?: string;
}
export class UpdateTaskDto extends CreateTaskDto {}

export class TaskResponseDto {
  @ApiProperty()
  @IsUUID()
  taskId!: string;

  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiProperty()
  xp!: number;

  @ApiProperty()
  credits!: number;

  @ApiProperty()
  completed!: boolean;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiProperty({ enum: ['personal', 'project'] })
  type!: string;

  @ApiProperty()
  isRewardClaimed!: boolean;

  constructor(task: Task) {
    this.taskId = task.taskId;
    this.userId = task.userId;
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.category = task.category;
    this.dueDate = task.dueDate;
    this.xp = task.xp;
    this.credits = task.credits;
    this.completed = task.completed;
    this.completedAt = task.completedAt;
    this.type = task.type;
    this.isRewardClaimed = task.isRewardClaimed;
  }
}

export class MoveTaskDto {
  @ApiProperty({
    description: 'ID status atau kolom tujuan yang baru',
    example: 'inprogress',
  })
  @IsString()
  @IsNotEmpty()
  newStatus!: string;
}
