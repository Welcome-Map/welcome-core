import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendWelcomeMail({ email, username, verificationCode }): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@welcome-map.org',
      subject: 'Welcome on Welcome Map',
      template: './welcome.hbs',
      context: {
        verificationCode,
        username,
      },
    });
  }

  async sendPAsswordResetMail({
    email,
    username,
    verificationCode,
  }: {
    email: string;
    username: string;
    verificationCode: string;
  }): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@welcome-map.org',
      subject: 'Reset your Welcome Map password',
      template: './password-reset.hbs',
      context: {
        verificationCode,
        username,
      },
    });
  }
}
