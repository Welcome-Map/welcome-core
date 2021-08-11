import { Length, IsEmail } from 'class-validator';

export class RegisterDTO {
  @Length(1, 255)
  username: string;

  @IsEmail()
  email: string;

  password: string;
}
