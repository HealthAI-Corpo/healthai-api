import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';

import { HealthController } from './health.controller';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { ClientIdGuard } from '../auth/guards/client-id.guard';

describe('HealthController (with global guards)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const healthCheckMock = {
      check: jest.fn().mockResolvedValue({ status: 'ok', info: {}, error: {}, details: {} }),
    };
    const dbMock = {
      pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckMock },
        { provide: TypeOrmHealthIndicator, useValue: dbMock },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              const map: Record<string, string> = {
                API_KEY: 'test-api-key',
                FRONTEND_CLIENT_ID: 'test-client-id',
              };
              if (!(key in map)) throw new Error(`Config key not found: ${key}`);
              return map[key];
            },
            get: (key: string, fallback?: string) => fallback,
          },
        },
        Reflector,
        { provide: APP_GUARD, useClass: ApiKeyGuard },
        { provide: APP_GUARD, useClass: ClientIdGuard },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 200 without x-api-key or x-client-id headers', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
