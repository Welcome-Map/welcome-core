import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { MailService } from '../src/mail/mail.service';
import { MailServiceMock } from './mocks/mail.service.mock';
import { OrganisationsModule } from '../src/organisations/organisations.module';
import * as request from 'supertest';
import { createUser } from './helpers/createUser';
import { nanoid } from 'nanoid';

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
  afterEach(async () => {
    app.close();
  });

  it('post / with a registered user', async () => {
    const orgName = nanoid();
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
        .send({ name: nanoid() })
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
        .send({ name: nanoid() })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    }

    const orgsRes = await request(app.getHttpServer())
      .get('/organisations?take=20&skip=10')
      .expect(200);

    expect(orgsRes.body.length).toEqual(20);
  });

  it('can edit org if creator', async () => {
    const { token } = await createUser(app);

    const res = await request(app.getHttpServer())
      .post('/organisations')
      .send({ name: nanoid() })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const org = res.body;
    const newOrgName = nanoid();

    const modifiedOrg = await request(app.getHttpServer())
      .put(`/organisations/${org.id}`)
      .send({ name: newOrgName })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(modifiedOrg.body.name).toEqual(newOrgName);
  });

  it('cannot edit org if not admin', async () => {
    const { token } = await createUser(app);

    const res = await request(app.getHttpServer())
      .post('/organisations')
      .send({ name: nanoid() })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const org = res.body;
    const newOrgName = nanoid();

    const { token: tokenNotAdmin } = await createUser(app);

    await request(app.getHttpServer())
      .put(`/organisations/${org.id}`)
      .send({ name: newOrgName })
      .set('Authorization', `Bearer ${tokenNotAdmin}`)
      .expect(403);
  });

  it('can add a user to an org', async () => {
    const { token } = await createUser(app);

    const regularUser = await createUser(app);

    const res = await request(app.getHttpServer())
      .post('/organisations')
      .send({ name: nanoid() })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const org = res.body;

    await request(app.getHttpServer())
      .post(`/organisations/${org.id}/join`)
      .send({ userId: regularUser.user.body.id })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const orgRes = await request(app.getHttpServer())
      .get(`/organisations/${org.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(orgRes.body.users[1].userName).toEqual(
      regularUser.user.body.username,
    );
  });
});
