import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('jwks-rsa', () =>
  jest.fn(() => ({
    getSigningKey: jest.fn(),
  })),
);

describe('AuthController', () => {
  let app: INestApplication<App>;
  const authServiceMock = {
    validateToken: jest.fn(),
    getPrimaryRole: jest.fn().mockReturnValue('user'),
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

  describe('GET /auth/validate', () => {
    it('should return 200 and inject headers when token is valid', async () => {
      authServiceMock.validateToken.mockResolvedValue({
        sub: 'zitadel-user-id',
        email: 'user@example.com',
      });

      const res = await request(app.getHttpServer())
        .get('/auth/validate')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(res.body).toEqual({ valid: true });
      expect(res.headers['x-user-id']).toBe('zitadel-user-id');
      expect(res.headers['x-user-role']).toBe('user');
    });

    it('should return 401 when Authorization header is missing', async () => {
      await request(app.getHttpServer()).get('/auth/validate').expect(401);
    });

    it('should return 401 when token is invalid', async () => {
      authServiceMock.validateToken.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/auth/validate')
        .set('Authorization', 'Bearer bad-token')
        .expect(401);
    });

    it('should return 401 when Authorization header is not Bearer', async () => {
      await request(app.getHttpServer())
        .get('/auth/validate')
        .set('Authorization', 'Basic dXNlcjpwYXNz')
        .expect(401);
    });
  });
});
