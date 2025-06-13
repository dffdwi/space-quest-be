import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';
import { ShopService } from './shop.service';
import { IsUUID } from 'class-validator';

class PurchaseItemDto {
  @IsUUID()
  itemId: string;
}

@ApiTags('Shop')
@Controller('shop')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('purchase')
  @ApiOperation({ summary: 'Membeli item dari toko' })
  async purchaseItem(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() purchaseItemDto: PurchaseItemDto,
  ) {
    return this.shopService.purchaseItem(
      req.user.userId,
      purchaseItemDto.itemId,
    );
  }
}
