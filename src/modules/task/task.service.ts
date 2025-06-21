import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.contract';
import { GameLogicService, GameEventResult } from '../game/game-logic.service';

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

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const { dueDate, ...rest } = createTaskDto;
    const taskPayload: any = {
      ...rest,
      userId,
      type: createTaskDto.projectId ? 'project' : 'personal',
    };
    if (dueDate) {
      taskPayload.dueDate = new Date(dueDate);
    }
    return this.taskModel.create(taskPayload);
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

  async move(taskId: string, userId: string, newStatus: string): Promise<Task> {
    const task = await this.findById(taskId, userId);
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
    await task.save();
    const eventResult = await this.gameLogicService.processTaskCompletion(
      userId,
      task.xp,
      task.credits,
    );

    return { task, eventResult };
  }

  async claimProjectTaskReward(
    taskId: string,
    userId: string,
  ): Promise<{ task: Task; eventResult: GameEventResult }> {
    const task = await this.findById(taskId, userId);

    if (task.type !== 'project') {
      throw new BadRequestException('Endpoint ini hanya untuk tugas proyek.');
    }
    if (task.status !== 'done') {
      throw new BadRequestException(
        'Tugas harus berada di kolom "Done" untuk klaim hadiah.',
      );
    }
    if (task.isRewardClaimed) {
      throw new BadRequestException('Hadiah untuk tugas ini sudah diklaim.');
    }

    task.isRewardClaimed = true;
    await task.save();

    const eventResult = await this.gameLogicService.processTaskCompletion(
      userId,
      task.xp,
      task.credits,
    );

    return { task, eventResult };
  }
}
