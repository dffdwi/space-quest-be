import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Request,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApplyFrameDto,
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
} from './user.contract';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserResponseDto } from './user.contract';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUserPayload } from '../auth/strategies/local.strategy';
import { ApplyThemeDto } from './user.contract';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat user baru (registrasi)' })
  @ApiResponse({
    status: 201,
    description: 'User berhasil dibuat.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email sudah terdaftar.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return new UserResponseDto(user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Mencari pengguna berdasarkan nama atau email' })
  async findAll(@Query('q') searchQuery: string) {
    const users = await this.userService.findAll(searchQuery);
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/profile/reset')
  @ApiOperation({ summary: 'Mereset semua progres game pengguna' })
  async resetProgress(
    @Request() req: { user: AuthenticatedUserPayload },
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.resetProgress(req.user.userId);
    return new UserResponseDto(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/profile/apply-theme')
  @ApiOperation({ summary: 'Menerapkan tema visual baru' })
  async applyTheme(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() applyThemeDto: ApplyThemeDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.applyTheme(
      req.user.userId,
      applyThemeDto.themeValue,
    );
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/profile/apply-frame')
  @ApiOperation({ summary: 'Menerapkan frame avatar baru' })
  async applyAvatarFrame(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() applyFrameDto: ApplyFrameDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.applyAvatarFrame(
      req.user.userId,
      applyFrameDto.frameValue,
    );
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile')
  @ApiOperation({ summary: 'Memperbarui nama dan avatar pengguna' })
  async updateProfile(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateProfile(
      req.user.userId,
      updateProfileDto.name,
      updateProfileDto.avatarUrl,
    );
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile/change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mengubah password pengguna' })
  @ApiResponse({ status: 204, description: 'Password berhasil diubah.' })
  @ApiResponse({
    status: 400,
    description: 'Data tidak valid atau password saat ini salah.',
  })
  async changePassword(
    @Request() req: { user: AuthenticatedUserPayload },
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(req.user.userId, changePasswordDto);
  }
}
