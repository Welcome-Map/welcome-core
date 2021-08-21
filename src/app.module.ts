import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { createFakeMailer } from './utils/createFakeMailer';
import { MailModule } from './mail/mail.module';
import { PrismaService } from './prisma.service';
import { OrganisationsModule } from './organisations/organisations.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport:
          process.env.NODE_ENV == 'production'
            ? process.env.SMTP
            : await createFakeMailer(),
        defaults: {
          from: '"Woozir" <no-reply@woozir.app>',
        },
        preview: process.env.NODE_ENV !== 'production',
        template: {
          dir: __dirname + '/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: __dirname + '/mail/templates/partials',
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
    UsersModule,
    AuthModule,
    MailModule,
    OrganisationsModule,
    CaslModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
