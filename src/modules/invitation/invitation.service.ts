import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectInvitation } from '../project/project_invitation.entity';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { ProjectMember } from '../project/project_member.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(ProjectInvitation)
    private readonly invitationModel: typeof ProjectInvitation,
    @InjectModel(ProjectMember)
    private readonly projectMemberModel: typeof ProjectMember,
    private sequelize: Sequelize,
  ) {}

  async findAllForUser(inviteeId: string): Promise<ProjectInvitation[]> {
    return this.invitationModel.findAll({
      where: {
        inviteeId,
        status: 'PENDING',
      },
      include: [
        {
          model: Project,
          attributes: ['projectId', 'name'],
        },
        {
          model: User,
          as: 'inviter',
          attributes: ['userId', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async accept(invitationId: string, userId: string): Promise<ProjectMember> {
    const invitation = await this.invitationModel.findByPk(invitationId);

    if (!invitation) {
      throw new NotFoundException('Undangan tidak ditemukan.');
    }
    if (invitation.inviteeId !== userId) {
      throw new ForbiddenException('Anda tidak berhak menerima undangan ini.');
    }
    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Undangan ini sudah tidak valid lagi.');
    }

    const t = await this.sequelize.transaction();
    try {
      invitation.status = 'ACCEPTED';
      await invitation.save({ transaction: t });

      const newMember = await this.projectMemberModel.create(
        {
          projectId: invitation.projectId,
          userId: invitation.inviteeId,
          role: invitation.role,
        },
        { transaction: t },
      );

      await t.commit();
      return newMember;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
