import { INestApplication } from '@nestjs/common';
import { internet } from 'faker';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import * as request from 'supertest';

export const createUser = async (app: INestApplication) => {
  const userPayload: RegisterDTO = {
    email: internet.email(),
    username: internet.userName(),
    password: internet.password(),
  };

  await request(app.getHttpServer())
    .post('/auth/signup')
    .send(userPayload)
    .expect(201);

  const user = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      username: userPayload.username,
      password: userPayload.password,
    })
    .expect(201);

  return { userPayload, token: user.body.access_token };
};