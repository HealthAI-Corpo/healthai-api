import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: INestApplication<App>;
  const authServiceMock = {
    login: jest.fn().mockResolvedValue({ access_token: 'jwt-token' }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /auth/login should return 200', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'p@ssw0rd123' })
      .expect(200);

    expect(authServiceMock.login).toHaveBeenCalled();
  });
});
