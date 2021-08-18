import { config } from 'dotenv';
config({ path: '.e2e.env' });
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { internet } from 'faker';
import { RegisterDTO } from '../src/auth/dto/register.dto';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { BullModule } from '@nestjs/bull';
import { MailService } from '../src/mail/mail.service';
import { MailServiceMock } from './mocks/mail.service.mock';
import { PrismaService } from '../src/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        PrismaService,
        BullModule.forRoot({
          redis: {
            host: 'localhost',
            port: 6380,
          },
        }),
      ],
      providers: [PrismaService],
    })
      .overrideProvider(MailService)
      .useValue(MailServiceMock)
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    usersService = app.get<UsersService>(UsersService);
    prisma = app.get(PrismaService);
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it('/signup (POST)', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);
    const res = await usersService.findByUsername(userPayload.username);
    expect(res.email).toEqual(userPayload.email);
    expect(res.passwordHash == userPayload.password).toBeFalsy();
  });

  it('Fail /signup (POST) with wrong userData', async () => {
    const userPayload: RegisterDTO = {
      email: 'toto',
      username: '',
      password: internet.password(),
    };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(400);
  });

  it('/login (POST)', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };
    const userCredentials = {
      username: userPayload.username,
      password: userPayload.password,
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userCredentials)
      .expect(201);

    expect(res.body.access_token).toBeTruthy();
  });
  it('/login (POST) fail with wrong credentials', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };
    const userCredentials = {
      username: userPayload.username,
      password: '1234',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(userCredentials)
      .expect(401);
  });

  it('/verify (GET)', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    const { code } = await prisma.accountVerification.findFirst({
      where: { user: { id: res.body.userId } },
    });

    const finalRes = await request(app.getHttpServer())
      .get(`/auth/verify/${code}`)
      .expect(200);
    expect(finalRes.body.verified).toEqual('ok');
  });

  it('/resetpassword (POST)', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };

    const userRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/lostpassword')
      .send({ email: userPayload.email })
      .expect(201);

    const { code } = await prisma.passwordReset.findFirst({
      where: { user: { id: userRes.body.userId } },
    });

    const newPassword = '123456abc';

    await request(app.getHttpServer())
      .post('/auth/password/')
      .send({ password: newPassword, code })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: userPayload.username, password: newPassword })
      .expect(201);
  });
  it('Fails /resetpassword (POST) with wrong code', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };

    const userRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/lostpassword')
      .send({ email: userPayload.email })
      .expect(201);

    const { code } = await prisma.passwordReset.findFirst({
      where: { user: { id: userRes.body.userId } },
    });

    const newPassword = '123456abc';
    await request(app.getHttpServer())
      .post('/auth/password/')
      .send({ password: newPassword, code: '1234' })
      .expect(500);
  });
});
