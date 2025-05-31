import { ApiProperty } from '@nestjs/swagger';
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
