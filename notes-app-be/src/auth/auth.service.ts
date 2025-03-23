import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { User } from '../schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user._id };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }
}
