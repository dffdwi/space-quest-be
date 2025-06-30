import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';
import { BadgeModule } from '../badge/badge.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BadgeModule),
    forwardRef(() => LeaderboardModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
