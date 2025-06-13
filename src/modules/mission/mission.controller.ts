import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MissionService } from './mission.service';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';
import { GameLogicService } from '../game/game-logic.service';

@ApiTags('Missions')
@Controller('missions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly gameLogicService: GameLogicService,
  ) {}

  @Get('my-progress')
  @ApiOperation({ summary: 'Mendapatkan progres misi pemain' })
  async getMyProgress(@Request() req: { user: AuthenticatedUserPayload }) {
    return this.missionService.getPlayerMissionProgress(req.user.userId);
  }

  @Post(':missionId/claim')
  @ApiOperation({ summary: 'Mengklaim hadiah misi' })
  async claimReward(
    @Request() req: { user: AuthenticatedUserPayload },
    @Param('missionId', new ParseUUIDPipe()) missionId: string,
  ) {
    const playerMission = await this.missionService.claimReward(
      req.user.userId,
      missionId,
    );

    // Panggil GameLogicService untuk memberikan reward
    const eventResult = await this.gameLogicService.processMissionClaim(
      req.user.userId,
      playerMission.mission,
    );

    return {
      message: 'Hadiah berhasil diklaim!',
      eventResult,
    };
  }
}
