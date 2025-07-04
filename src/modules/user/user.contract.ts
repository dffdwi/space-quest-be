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
  IsUrl,
  Matches,
} from 'class-validator';
import { PlayerStats } from './player_stats.entity';
import { Badge } from '../badge/badge.entity';
import { PlayerInventory } from '../shop/player_inventory.entity';
import { PlayerActivePowerUp } from '../shop/player_active_powerup.entity';

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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, dan angka/simbol.',
  })
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

export class UpdateProfileDto {
  @IsString()
  name: string;

  // @IsUrl()
  @IsOptional()
  avatarUrl: string;
}

class PlayerStatsDto {
  @ApiProperty()
  tasksCompleted: number;

  @ApiProperty()
  totalXpEarned: number;

  @ApiProperty()
  totalCreditsEarned: number;

  @ApiProperty()
  longestMissionStreak: number;

  @ApiProperty()
  dailyPersonalXpGained: number;

  @ApiProperty()
  dailyPersonalCpGained: number;
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

  @ApiProperty({ type: () => PlayerStatsDto })
  stats: PlayerStatsDto;

  @ApiProperty()
  badges?: Badge[];

  @ApiPropertyOptional({ type: () => [PlayerInventory] })
  inventory?: PlayerInventory[];

  @ApiPropertyOptional({ description: 'Jumlah undangan proyek yang pending' })
  pendingInvitationCount?: number;

  @ApiPropertyOptional({ type: () => [PlayerActivePowerUp] })
  activePowerUps?: PlayerActivePowerUp[];

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
    this.pendingInvitationCount = user.receivedInvitations?.length || 0;
    this.activePowerUps = user.activePowerUps;
  }
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Password saat ini',
    example: 'P@sswOrd123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({
    description:
      'Password baru (minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka)',
    example: 'NewP@ssw0rd!',
  })
  @IsString()
  @MinLength(8, { message: 'Password baru minimal 8 karakter' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password baru terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, dan angka/simbol.',
  })
  newPassword!: string;

  @ApiProperty({
    description: 'Konfirmasi password baru',
    example: 'NewP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}
