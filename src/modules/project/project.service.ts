import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './project.entity';
import { CreateProjectDto, AddMemberDto } from './project.contract';
import { User } from '../user/user.entity';
import { ProjectMember } from './project_member.entity';
import { ProjectColumn } from './project_column.entity';
import { Task } from '../task/task.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(ProjectMember)
    private readonly projectMemberModel: typeof ProjectMember,
    @InjectModel(ProjectColumn)
    private readonly projectColumnModel: typeof ProjectColumn,
    private readonly userService: UserService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    ownerId: string,
  ): Promise<Project> {
    const project = await this.projectModel.create({
      ...createProjectDto,
      ownerId,
    });

    await this.projectMemberModel.create({
      projectId: project.projectId,
      userId: ownerId,
      role: 'Commander',
    });

    await this.projectColumnModel.bulkCreate([
      { projectId: project.projectId, title: 'Backlog', order: 0 },
      { projectId: project.projectId, title: 'To Do', order: 1 },
      { projectId: project.projectId, title: 'In Progress', order: 2 },
      { projectId: project.projectId, title: 'Done', order: 3 },
    ]);

    return this.findById(project.projectId, ownerId);
  }

  async findAllForUser(userId: string): Promise<Project[]> {
    return this.projectModel.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { userId },
          attributes: [],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectModel.findByPk(projectId, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['userId', 'name', 'avatarUrl'],
          through: {
            attributes: ['role'],
          },
        },
        {
          model: ProjectColumn,
          as: 'columns',
          order: [['order', 'ASC']],
        },
        {
          model: Task,
          as: 'tasks',
        },
      ],
    });

    if (!project) {
      throw new NotFoundException(
        `Proyek dengan ID ${projectId} tidak ditemukan.`,
      );
    }

    const isMember = project.members.some((member) => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Anda bukan anggota dari proyek ini.');
    }

    return project;
  }

  async addMember(
    projectId: string,
    addMemberDto: AddMemberDto,
    currentUserId: string,
  ): Promise<ProjectMember> {
    const project = await this.findById(projectId, currentUserId);

    if (project.ownerId !== currentUserId) {
      throw new ForbiddenException(
        'Hanya pemilik proyek yang bisa menambah anggota.',
      );
    }

    const userToAdd = await this.userService.findOneByEmail(addMemberDto.email);
    if (!userToAdd) {
      throw new NotFoundException(
        `User dengan email ${addMemberDto.email} tidak ditemukan.`,
      );
    }

    const existingMember = await this.projectMemberModel.findOne({
      where: { projectId, userId: userToAdd.userId },
    });
    if (existingMember) {
      throw new ConflictException(`User ini sudah menjadi anggota proyek.`);
    }

    return this.projectMemberModel.create({
      projectId,
      userId: userToAdd.userId,
      role: addMemberDto.role || 'Crew Member',
    });
  }
}
