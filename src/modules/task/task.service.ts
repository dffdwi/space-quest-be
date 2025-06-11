import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.contract';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
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
}
