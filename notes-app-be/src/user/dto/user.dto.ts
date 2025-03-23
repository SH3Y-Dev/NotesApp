import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
