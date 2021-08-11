import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendWelcomeMail({ email, username, verificationCode }): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@woozir.app',
      subject: 'Bienvenue sur Woozir',
      template: './welcome.hbs',
      context: {
        verificationCode,
        username,
      },
    });
  }
}
