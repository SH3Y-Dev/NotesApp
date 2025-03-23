import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);

    const { accessToken } = await this.authService.login(user);

    return res.json({ accessToken, message: 'Login successful' });
  }
}
