import { Module, forwardRef } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UserModule } from '../user/user.module';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [forwardRef(() => UserModule), BadgeModule],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
