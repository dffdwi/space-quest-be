import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';
import { DailyService } from './daily.service';

@ApiTags('Daily Mechanics')
@Controller('daily')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Melakukan check-in harian untuk bonus streak' })
  async checkIn(@Request() req: { user: AuthenticatedUserPayload }) {
    return this.dailyService.processCheckIn(req.user.userId);
  }

  @Post('claim-discovery')
  @ApiOperation({ summary: 'Mengklaim hadiah penemuan harian' })
  async claimDiscovery(@Request() req: { user: AuthenticatedUserPayload }) {
    return this.dailyService.claimDailyDiscovery(req.user.userId);
  }
}
