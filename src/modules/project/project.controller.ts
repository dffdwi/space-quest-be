import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';
import {
  AddMemberDto,
  CreateProjectDto,
  ProjectDetailResponseDto,
} from './project.contract';
import { ProjectService } from './project.service';
import { Project } from './project.entity';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan semua proyek yang diikuti pengguna' })
  async findAll(@Request() req: { user: AuthenticatedUserPayload }) {
    return this.projectService.findAllForUser(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Membuat proyek baru' })
  @ApiResponse({ status: 201, type: ProjectDetailResponseDto })
  async create(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.create(
      createProjectDto,
      req.user.userId,
    );
    return new ProjectDetailResponseDto(project);
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Mendapatkan detail proyek beserta tugasnya' })
  @ApiResponse({ status: 200, type: ProjectDetailResponseDto })
  async findOne(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    const project = await this.projectService.findById(
      projectId,
      req.user.userId,
    );
    return new ProjectDetailResponseDto(project);
  }

  @Post(':projectId/members')
  @ApiOperation({ summary: 'Menambahkan anggota baru ke proyek' })
  async addMember(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.projectService.addMember(
      projectId,
      addMemberDto,
      req.user.userId,
    );
  }
}
