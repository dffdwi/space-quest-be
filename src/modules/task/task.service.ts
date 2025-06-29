import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.contract';
import { GameLogicService, GameEventResult } from '../game/game-logic.service';
import { Project } from '../project/project.entity';
import { ProjectColumn } from '../project/project_column.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
    private readonly gameLogicService: GameLogicService,
  ) {}

  async findAllForUser(userId: string): Promise<Task[]> {
    return this.taskModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { taskId, userId },
    });
    if (!task) {
      throw new NotFoundException(
        `Tugas dengan ID ${taskId} tidak ditemukan atau bukan milik Anda.`,
      );
    }
    return task;
  }

  async create(creatorId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const { dueDate, ...rest } = createTaskDto;

    const taskPayload: any = {
      ...rest,
      userId: createTaskDto.assignedTo || creatorId,
      createdBy: creatorId,
      type: createTaskDto.projectId ? 'project' : 'personal',
    };

    if (dueDate) {
      taskPayload.dueDate = new Date(dueDate);
    }

    const task = await this.taskModel.create(taskPayload);
    return task;
  }

  async update(
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findById(taskId, userId);
    const { dueDate, ...rest } = updateTaskDto;
    const updatePayload: any = { ...rest };
    if (dueDate) {
      updatePayload.dueDate = new Date(dueDate);
    } else if (updateTaskDto.hasOwnProperty('dueDate')) {
      updatePayload.dueDate = null;
    }
    await task.update(updatePayload);
    return task;
  }

  async move(
    taskId: string,
    currentUserId: string,
    newStatus: string,
  ): Promise<Task> {
    const task = await this.taskModel.findByPk(taskId, { include: [Project] });

    if (!task) {
      throw new NotFoundException(`Tugas dengan ID ${taskId} tidak ditemukan.`);
    }

    if (task.type === 'project') {
      if (!task.project) {
        throw new NotFoundException(
          'Data proyek untuk tugas ini tidak ditemukan.',
        );
      }
      if (task.project.ownerId !== currentUserId) {
        throw new ForbiddenException(
          'Hanya pemilik proyek yang bisa memindahkan tugas secara langsung. Silakan gunakan fitur "request move".',
        );
      }
    } else {
      if (task.userId !== currentUserId) {
        throw new ForbiddenException(
          'Anda tidak bisa memindahkan tugas milik orang lain.',
        );
      }
    }

    task.status = newStatus;
    await task.save();
    return task;
  }

  async complete(
    taskId: string,
    userId: string,
  ): Promise<{ task: Task; eventResult: GameEventResult }> {
    const task = await this.findById(taskId, userId);

    if (task.type !== 'personal') {
      throw new BadRequestException('Endpoint ini hanya untuk tugas personal.');
    }
    if (task.completed) {
      throw new BadRequestException('Tugas ini sudah diselesaikan.');
    }

    task.completed = true;
    task.completedAt = new Date();
    task.isRewardClaimed = true;
    await task.save();

    const eventResult = await this.gameLogicService.processTaskCompletion(
      userId,
      task.xp,
      task.credits,
      'personal',
    );

    return { task, eventResult };
  }

  async claimProjectTaskReward(
    taskId: string,
    currentUserId: string,
  ): Promise<{ task: Task; eventResult: GameEventResult }> {
    const task = await this.taskModel.findByPk(taskId, {
      include: [{ model: Project, include: [ProjectColumn] }],
    });

    if (!task) {
      throw new NotFoundException(`Tugas dengan ID ${taskId} tidak ditemukan.`);
    }

    if (task.type !== 'project' || !task.project) {
      throw new BadRequestException('Endpoint ini hanya untuk tugas proyek.');
    }
    if (task.isRewardClaimed) {
      throw new BadRequestException('Hadiah untuk tugas ini sudah diklaim.');
    }
    if (!task.userId) {
      throw new BadRequestException('Tugas ini tidak di-assign ke siapa pun.');
    }

    const doneColumn = task.project.columns.find((col) =>
      col.title.toLowerCase().includes('done'),
    );

    if (!doneColumn) {
      throw new NotFoundException(
        'Kolom "Done" tidak ditemukan untuk proyek ini.',
      );
    }

    if (task.status !== doneColumn.columnId) {
      throw new BadRequestException(
        'Tugas harus berada di kolom "Done" untuk klaim hadiah.',
      );
    }

    task.isRewardClaimed = true;
    await task.save();

    const eventResult = await this.gameLogicService.processTaskCompletion(
      task.userId,
      task.xp,
      task.credits,
      'project',
      task.projectId,
    );

    return { task, eventResult };
  }

  async requestMove(
    taskId: string,
    requesterId: string,
    targetStatus: string,
    message?: string,
  ): Promise<Task> {
    const task = await this.taskModel.findByPk(taskId, { include: [Project] });

    if (!task || !task.project) {
      throw new NotFoundException('Tugas proyek tidak ditemukan.');
    }

    if (task.project.ownerId === requesterId) {
      throw new BadRequestException(
        'Pemilik proyek bisa langsung memindahkan tugas.',
      );
    }

    task.statusChangeRequest = targetStatus;
    task.statusChangeRequesterId = requesterId;
    task.statusChangeMessage = message;

    return task.save();
  }

  async reviewMove(
    taskId: string,
    ownerId: string,
    action: 'approve' | 'reject',
  ): Promise<Task> {
    const task = await this.taskModel.findByPk(taskId, { include: [Project] });

    if (!task || !task.project) {
      throw new NotFoundException('Tugas proyek tidak ditemukan.');
    }
    if (task.project.ownerId !== ownerId) {
      throw new ForbiddenException(
        'Hanya pemilik proyek yang bisa meninjau permintaan.',
      );
    }
    if (!task.statusChangeRequest) {
      throw new BadRequestException(
        'Tidak ada permintaan perpindahan untuk tugas ini.',
      );
    }

    if (action === 'approve') {
      task.status = task.statusChangeRequest;
    }

    task.statusChangeRequest = null;
    task.statusChangeRequesterId = null;
    task.statusChangeMessage = null;

    return task.save();
  }
}
