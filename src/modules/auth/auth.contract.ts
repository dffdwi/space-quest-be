import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../user/user.contract';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @ApiProperty({ example: 'P@sswOrd123' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  //   @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}
export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
