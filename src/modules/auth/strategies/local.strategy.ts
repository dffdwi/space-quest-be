import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

export type AuthenticatedUserPayload = {
  id: number;
  email: string;
  name?: string;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    pass: string,
  ): Promise<AuthenticatedUserPayload> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah.');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
