import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
    forwardRef(() => GameModule),
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [SequelizeModule],
})
export class TaskModule {}
