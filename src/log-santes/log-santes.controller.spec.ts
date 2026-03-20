import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { LogSantesController } from './log-santes.controller';
import { LogSantesService } from './log-santes.service';

describe('LogSantesController', () => {
  let app: INestApplication<App>;
  const logSantesServiceMock = {
    create: jest.fn().mockResolvedValue({ idLogSante: 1 }),
    findAll: jest.fn().mockResolvedValue([{ idLogSante: 1 }]),
    findOne: jest.fn().mockResolvedValue({ idLogSante: 1 }),
    update: jest.fn().mockResolvedValue({ idLogSante: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LogSantesController],
      providers: [
        { provide: LogSantesService, useValue: logSantesServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /log-santes should return 201', () =>
    request(app.getHttpServer())
      .post('/log-santes')
      .send({ idUtilisateur: 1, poidsKg: 72, moyenneBpm: 65, heuresSommeil: 8 })
      .expect(201));

  it('GET /log-santes should return 200', () =>
    request(app.getHttpServer()).get('/log-santes').expect(200));

  it('GET /log-santes/:id should return 200', () =>
    request(app.getHttpServer()).get('/log-santes/1').expect(200));

  it('PATCH /log-santes/:id should return 200', () =>
    request(app.getHttpServer())
      .patch('/log-santes/1')
      .send({ poidsKg: 71.5 })
      .expect(200));

  it('DELETE /log-santes/:id should return 200', () =>
    request(app.getHttpServer()).delete('/log-santes/1').expect(200));
});
