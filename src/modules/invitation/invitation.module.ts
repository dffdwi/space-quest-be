import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectInvitation } from '../project/project_invitation.entity';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectInvitation]),
    forwardRef(() => ProjectModule),
  ],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
