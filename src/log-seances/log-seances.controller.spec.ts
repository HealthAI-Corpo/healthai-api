import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { LogSeancesController } from './log-seances.controller';
import { LogSeancesService } from './log-seances.service';

describe('LogSeancesController', () => {
  let app: INestApplication<App>;
  const logSeancesServiceMock = {
    create: jest.fn().mockResolvedValue({ idSeanceLog: 1 }),
    findAll: jest.fn().mockResolvedValue([{ idSeanceLog: 1 }]),
    findOne: jest.fn().mockResolvedValue({ idSeanceLog: 1 }),
    update: jest.fn().mockResolvedValue({ idSeanceLog: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LogSeancesController],
      providers: [
        { provide: LogSeancesService, useValue: logSeancesServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /log-seances should return 201', () =>
    request(app.getHttpServer())
      .post('/log-seances')
      .send({
        idExercice: 1,
        idUtilisateur: 1,
        dureeExercice: 30,
        calorieBrulee: 220,
      })
      .expect(201));

  it('GET /log-seances should return 200', () =>
    request(app.getHttpServer()).get('/log-seances').expect(200));

  it('GET /log-seances/:id should return 200', () =>
    request(app.getHttpServer()).get('/log-seances/1').expect(200));

  it('PATCH /log-seances/:id should return 200', () =>
    request(app.getHttpServer())
      .patch('/log-seances/1')
      .send({ dureeExercice: 40 })
      .expect(200));

  it('DELETE /log-seances/:id should return 200', () =>
    request(app.getHttpServer()).delete('/log-seances/1').expect(200));
});
