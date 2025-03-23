import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as argon2 from 'argon2';
import { User } from 'src/schema/user.schema';
import { CreateUserDto } from './dto/user.dto';
import { generatePassword } from './utils/user.utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const { firstName, lastName, email } = createUserDto;

    const generatedPassword = generatePassword(firstName, lastName);

    const hashedPassword = await argon2.hash(generatedPassword);

    const user = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMPT_EMAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_EMAIL,
      to: email,
      subject: 'Your Account Password',
      text: `Hello ${firstName},\n\nYour account has been created. Your password is: ${generatedPassword}\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);

    return { message: `Please check ${email} for credentials ` };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { message: 'Login successful', user };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
