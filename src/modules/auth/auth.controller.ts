import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.contract';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto } from './auth.contract';
import { CreateUserDto } from '../user/user.contract';
import { UserResponseDto } from '../user/user.contract';
import { AuthenticatedUserPayload } from './strategies/local.strategy';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
  async getProfile(
    @Request() req: { user: AuthenticatedUserPayload },
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(req.user.userId);
    return new UserResponseDto(user);
  }
}
