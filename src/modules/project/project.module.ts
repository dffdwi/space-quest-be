import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './project.entity';
import { ProjectColumn } from './project_column.entity';
import { ProjectMember } from './project_member.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { UserModule } from '../user/user.module';
import { ProjectInvitation } from './project_invitation.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Project,
      ProjectColumn,
      ProjectMember,
      ProjectInvitation,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [SequelizeModule],
})
export class ProjectModule {}
