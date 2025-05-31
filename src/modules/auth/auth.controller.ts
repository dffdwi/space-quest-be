import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth.response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponseDto } from '../user/dto/user.response.dto';
import { User } from '../user/user.entity';
import { AuthenticatedUserPayload } from './strategies/local.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrasi user baru' })
  @ApiResponse({
    status: 201,
    description: 'User berhasil diregistrasi.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email sudah terdaftar.' })
  @ApiResponse({ status: 400, description: 'Input tidak valid.' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Email atau password salah.' })
  async login(
    @Request() req: { user: AuthenticatedUserPayload },
  ): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Mendapatkan profil user yang sedang login' })
  @ApiResponse({
    status: 200,
    description: 'Profil user.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Tidak terotorisasi.' })
  getProfile(
    @Request() req: { user: AuthenticatedUserPayload },
  ): UserResponseDto {
    return new UserResponseDto(req.user);
  }
}
