import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { MailService } from '../src/mail/mail.service';
import { MailServiceMock } from './mocks/mail.service.mock';
import { OrganisationsModule } from '../src/organisations/organisations.module';
import { company } from 'faker';
import * as request from 'supertest';
import { createUser } from './helpers/createUser';

describe('Organisations (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
    const orgName = company.companyName();
    const { token } = await createUser(app);

    const res = await request(app.getHttpServer())
      .post('/organisations')
      .send({ name: orgName })
      .set('Authorization', `Bearer ${token}`)
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
    const { token } = await createUser(app);

    for (let i = 0; i <= 30; i++) {
      await request(app.getHttpServer())
        .post('/organisations')
        .send({ name: company.companyName() })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    }

    const orgsRes = await request(app.getHttpServer())
      .get('/organisations')
      .expect(200);

    expect(orgsRes.body.length).toEqual(10);
  });

  it('can list all org with pagination', async () => {
    const { token } = await createUser(app);

    for (let i = 0; i <= 60; i++) {
      await request(app.getHttpServer())
        .post('/organisations')
        .send({ name: company.companyName() })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    }

    const orgsRes = await request(app.getHttpServer())
      .get('/organisations?take=20&skip=10')
      .expect(200);

    expect(orgsRes.body.length).toEqual(20);
  });
});
