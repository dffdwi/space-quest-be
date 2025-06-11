import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './auth.contract';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthenticatedUserPayload } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/user.contract';
import { CreateUserDto } from '../user/user.contract';
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
      sub: userPayload.userId,
    };
    const accessToken = this.jwtService.sign(jwtTokenPayload);

    const user = await this.userService.findById(userPayload.userId);
    if (!user) {
      throw new NotFoundException(
        `User dengan ID ${userPayload.userId} tidak ditemukan`,
      );
    }

    return {
      accessToken,
      user: new UserResponseDto(user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const createdUser = await this.userService.create(createUserDto);
    return new UserResponseDto(createdUser);
  }
}
