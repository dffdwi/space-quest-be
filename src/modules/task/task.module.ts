import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [SequelizeModule],
})
export class TaskModule {}
