import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth.response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthenticatedUserPayload } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user.response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await user.comparePassword(pass))) {
      return user;
    }
    return null;
  }

  async login(userPayload: AuthenticatedUserPayload): Promise<AuthResponseDto> {
    const jwtTokenPayload: JwtPayload = {
      email: userPayload.email,
      sub: userPayload.id,
    };
    const accessToken = this.jwtService.sign(jwtTokenPayload);

    return {
      accessToken,
      user: new UserResponseDto({
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name,
      }),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }
}
