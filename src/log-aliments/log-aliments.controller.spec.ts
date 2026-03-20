import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { LogAlimentsController } from './log-aliments.controller';
import { LogAlimentsService } from './log-aliments.service';

describe('LogAlimentsController', () => {
  let app: INestApplication<App>;
  const logAlimentsServiceMock = {
    create: jest.fn().mockResolvedValue({ idLogAliment: 1 }),
    findAll: jest.fn().mockResolvedValue([{ idLogAliment: 1 }]),
    findOne: jest.fn().mockResolvedValue({ idLogAliment: 1 }),
    update: jest.fn().mockResolvedValue({ idLogAliment: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LogAlimentsController],
      providers: [
        { provide: LogAlimentsService, useValue: logAlimentsServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /log-aliments should return 201', () =>
    request(app.getHttpServer())
      .post('/log-aliments')
      .send({
        idAliment: 1,
        idUtilisateur: 1,
        repas: 'Petit-déjeuner',
        quantiteG: 120,
      })
      .expect(201));

  it('GET /log-aliments should return 200', () =>
    request(app.getHttpServer()).get('/log-aliments').expect(200));

  it('GET /log-aliments/:id should return 200', () =>
    request(app.getHttpServer()).get('/log-aliments/1').expect(200));

  it('PATCH /log-aliments/:id should return 200', () =>
    request(app.getHttpServer())
      .patch('/log-aliments/1')
      .send({ quantiteG: 130 })
      .expect(200));

  it('DELETE /log-aliments/:id should return 200', () =>
    request(app.getHttpServer()).delete('/log-aliments/1').expect(200));
});
