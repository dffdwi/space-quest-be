import { Module, forwardRef } from '@nestjs/common';
import { DailyService } from './daily.service';

import { UserModule } from '../user/user.module';
import { DailyController } from './daily.controller';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [DailyService],
  controllers: [DailyController],
})
export class DailyModule {}
