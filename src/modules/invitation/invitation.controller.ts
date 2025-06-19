import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';
import { InvitationService } from './invitation.service';

@ApiTags('Invitations')
@Controller('invitations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  @ApiOperation({
    summary: 'Mendapatkan semua undangan yang pending untuk pengguna',
  })
  async findAll(@Request() req: { user: AuthenticatedUserPayload }) {
    return this.invitationService.findAllForUser(req.user.userId);
  }

  @Put(':invitationId/accept')
  @ApiOperation({ summary: 'Menerima undangan untuk bergabung ke proyek' })
  async accept(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
  ) {
    return this.invitationService.accept(invitationId, req.user.userId);
  }

  @Put(':invitationId/reject')
  @ApiOperation({ summary: 'Menolak undangan untuk bergabung ke proyek' })
  async reject(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('invitationId', new ParseUUIDPipe()) invitationId: string,
  ) {
    return this.invitationService.reject(invitationId, req.user.userId);
  }
}
