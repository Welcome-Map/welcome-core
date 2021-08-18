import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { MailService } from '../src/mail/mail.service';
import { MailServiceMock } from './mocks/mail.service.mock';
import { OrganisationsModule } from '../src/organisations/organisations.module';
import { RegisterDTO } from '../src/auth/dto/register.dto';
import { internet, company } from 'faker';
import * as request from 'supertest';

describe('Organisations (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        PrismaService,
        OrganisationsModule,
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
    await app.init();
  });

  it('post / with a registered user', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };

    const orgName = company.companyName();
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    const userRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: userPayload.username,
        password: userPayload.password,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/organisations')
      .send({ name: orgName })
      .set('Authorization', `Bearer ${userRes.body.access_token}`)
      .expect(201);

    expect(res.body.name).toEqual(orgName);
  });

  it("can't post / with an unregistered user", async () => {
    await request(app.getHttpServer())
      .post('/organisations')
      .send({ name: 'testorg' })
      .expect(401);
  });

  it('can list all orgs', async () => {
    const userPayload: RegisterDTO = {
      email: internet.email(),
      username: internet.userName(),
      password: internet.password(),
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userPayload)
      .expect(201);

    const userRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: userPayload.username,
        password: userPayload.password,
      })
      .expect(201);

    for (let i = 0; i <= 30; i++) {
      await request(app.getHttpServer())
        .post('/organisations')
        .send({ name: company.companyName() })
        .set('Authorization', `Bearer ${userRes.body.access_token}`)
        .expect(201);
    }

    const orgsRes = await request(app.getHttpServer())
      .get('/organisations')
      .expect(200);

    expect(orgsRes.body.length).toEqual(10);
  });
});
