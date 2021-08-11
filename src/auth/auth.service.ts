import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { UpdatepasswordDto } from './dto/updatepassword.dto';
import { PrismaService } from '../prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Partial<User>> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async register({
    username,
    email,
    password,
  }: RegisterDTO): Promise<Partial<User>> {
    const passwordHash = await hash(password, 10);
    const user = await this.usersService.create({
      username,
      email,
      passwordHash,
    });
    const verificationCode: string = uuidv4();
    const account = await this.prisma.accountVerification.create({
      data: { code: verificationCode, user: { connect: { id: user.id } } },
    });

    await this.mailService.sendWelcomeMail({
      email,
      username,
      verificationCode,
    });

    return account;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async verify(code: string): Promise<void> {
    const accountVerification = await this.prisma.accountVerification.findFirst(
      {
        where: {
          code,
        },
        include: {
          user: true,
        },
      },
    );

    await this.usersService.update({
      where: { id: accountVerification.user.id },
      data: {
        verified: true,
      },
    });

    await this.prisma.accountVerification.delete({
      where: { id: accountVerification.id },
    });
  }

  async generateResetPasswordCode(email: string): Promise<void> {
    const code: string = uuidv4();
    const user = await this.usersService.findByEmail(email);

    await this.prisma.passwordReset.create({
      data: {
        code,
        user: { connect: { id: user.id } },
      },
    });
  }

  async updatePassword({ code, password }: UpdatepasswordDto) {
    const resetPassword = await this.prisma.passwordReset.findUnique({
      where: { code },
      include: {
        user: true,
      },
    });

    const passwordHash = await hash(password, 10);

    await this.usersService.update({
      where: { id: resetPassword.user.id },
      data: { passwordHash },
    });

    await this.prisma.passwordReset.delete({ where: { id: resetPassword.id } });
  }
}
