import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import request from 'supertest';
import { App } from 'supertest/types';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const healthCheckMock = {
      check: jest
        .fn()
        .mockResolvedValue({ status: 'ok', info: {}, error: {}, details: {} }),
    };
    const dbMock = {
      pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckMock },
        { provide: TypeOrmHealthIndicator, useValue: dbMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 200 on /health', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
