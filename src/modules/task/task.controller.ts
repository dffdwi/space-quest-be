import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  MoveTaskDto,
  TaskResponseDto,
  UpdateTaskDto,
} from './task.contract';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan semua tugas milik pengguna' })
  @ApiResponse({ status: 200, type: [TaskResponseDto] })
  async findAll(@Request() req: { user: AuthenticatedUserPayload }) {
    const tasks = await this.taskService.findAllForUser(req.user.userId);
    return tasks.map((task) => new TaskResponseDto(task));
  }

  @Post()
  @ApiOperation({ summary: 'Membuat tugas baru' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  async create(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const task = await this.taskService.create(req.user.userId, createTaskDto);
    return new TaskResponseDto(task);
  }

  @Put(':taskId')
  @ApiOperation({ summary: 'Memperbarui tugas' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async update(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const updatedTask = await this.taskService.update(
      taskId,
      req.user.userId,
      updateTaskDto,
    );
    return new TaskResponseDto(updatedTask);
  }

  @Put(':taskId/move')
  @ApiOperation({ summary: 'Memindahkan tugas ke kolom Kanban lain' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async moveTask(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() moveTaskDto: MoveTaskDto,
  ) {
    const movedTask = await this.taskService.move(
      taskId,
      req.user.userId,
      moveTaskDto.newStatus,
    );
    return new TaskResponseDto(movedTask);
  }

  @Post(':taskId/complete')
  @ApiOperation({ summary: 'Menyelesaikan sebuah tugas' })
  @ApiResponse({
    status: 200,
    description: 'Tugas berhasil diselesaikan, mengembalikan hasil event game.',
  })
  async completeTask(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ) {
    const { task, eventResult } = await this.taskService.complete(
      taskId,
      req.user.userId,
    );
    return {
      task: new TaskResponseDto(task),
      eventResult,
    };
  }

  @Post(':taskId/claim-reward')
  @ApiOperation({ summary: 'Mengklaim hadiah untuk tugas proyek yang selesai' })
  @ApiResponse({
    status: 200,
    description: 'Hadiah berhasil diklaim.',
  })
  async claimProjectTaskReward(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ) {
    const { task, eventResult } = await this.taskService.claimProjectTaskReward(
      taskId,
      req.user.userId,
    );
    return {
      task: new TaskResponseDto(task),
      eventResult,
    };
  }
}
