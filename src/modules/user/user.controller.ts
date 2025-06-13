import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.contract';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserResponseDto } from './user.contract';

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
    return this.userService.create(createUserDto);
  }

  /*
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail user berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return new UserResponseDto({ id: user.id, email: user.email, name: user.name });
  }
  */
}
