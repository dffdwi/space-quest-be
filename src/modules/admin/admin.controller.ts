import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AdminService } from './admin.service';

class AwardBadgeDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  badgeId: string;
}

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('award-badge')
  @ApiOperation({ summary: 'Memberikan lencana ke pengguna secara manual' })
  async awardBadge(@Body() awardBadgeDto: AwardBadgeDto) {
    return this.adminService.awardBadge(
      awardBadgeDto.userId,
      awardBadgeDto.badgeId,
    );
  }

  @Post('award-leaderboard-badges')
  @ApiOperation({
    summary:
      'Secara otomatis memberikan lencana ke 3 pemain teratas di leaderboard',
  })
  async awardLeaderboardBadges() {
    return this.adminService.awardLeaderboardBadges();
  }
}
