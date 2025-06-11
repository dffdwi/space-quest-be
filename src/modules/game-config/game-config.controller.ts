import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameConfigService } from './game-config.service';

@ApiTags('Game Config')
@Controller('game-config')
export class GameConfigController {
  constructor(private readonly gameConfigService: GameConfigService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ summary: 'Mengambil semua konfigurasi game' })
  @ApiResponse({
    status: 200,
    description: 'Data konfigurasi game berhasil diambil.',
  })
  async getAllGameConfig() {
    return this.gameConfigService.getAllGameConfig();
  }
}
