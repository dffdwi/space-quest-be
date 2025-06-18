import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectInvitation } from '../project/project_invitation.entity';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectInvitation]),
    forwardRef(() => ProjectModule),
    forwardRef(() => UserModule),
  ],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
