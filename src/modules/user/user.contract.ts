import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { User } from './user.entity';
import { PlayerStats } from './player_stats.entity';
import { Badge } from '../badge/badge.entity';
import { PlayerInventory } from '../shop/player_inventory.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email pengguna',
  })
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email!: string;

  @ApiProperty({
    example: 'P@sswOrd123',
    description: 'Password pengguna (minimal 8 karakter)',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password!: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Nama pengguna (opsional)',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class ApplyThemeDto {
  @IsString()
  themeValue: string;
}

export class ApplyFrameDto {
  @IsOptional()
  @IsString()
  frameValue: string | null;
}

export class UserResponseDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  name?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'https://.../avatar.png', nullable: true })
  avatarUrl?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  level!: number;

  @ApiProperty({ example: 1350 })
  @IsInt()
  xp!: number;

  @ApiProperty({ example: 500 })
  @IsInt()
  credits!: number;

  @ApiProperty({ example: 'theme-nebula-dark' })
  @IsString()
  activeTheme!: string;

  @ApiProperty({
    example: 'gold-commander-frame',
    nullable: true,
  })
  activeAvatarFrameId?: string;

  @ApiProperty({ example: '2025-06-11T00:00:00.000Z', nullable: true })
  @IsOptional()
  @IsDateString()
  lastLoginDate?: Date;

  @ApiProperty({ example: 3 })
  @IsInt()
  loginStreak!: number;

  @ApiProperty({ example: '2025-06-11T00:00:00.000Z', nullable: true })
  @IsOptional()
  @IsDateString()
  lastDiscoveryDate?: Date;

  @ApiProperty()
  stats!: PlayerStats;

  @ApiProperty()
  badges?: Badge[];

  @ApiPropertyOptional({ type: () => [PlayerInventory] })
  inventory?: PlayerInventory[];

  constructor(user: any) {
    this.userId = user.userId;
    this.name = user.name;
    this.email = user.email;
    this.avatarUrl = user.avatarUrl;
    this.level = user.level;
    this.xp = user.xp;
    this.credits = user.credits;
    this.activeTheme = user.activeTheme;
    this.activeAvatarFrameId = user.activeAvatarFrameId;
    this.lastLoginDate = user.lastLoginDate;
    this.loginStreak = user.loginStreak;
    this.lastDiscoveryDate = user.lastDiscoveryDate;
    this.stats = user.stats;
    this.badges = user.badges;
    this.inventory = user.inventory;
  }
}
