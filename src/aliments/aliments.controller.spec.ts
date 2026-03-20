import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AlimentsController } from './aliments.controller';
import { AlimentsService } from './aliments.service';

describe('AlimentsController', () => {
  let app: INestApplication<App>;
  const alimentsServiceMock = {
    create: jest.fn().mockResolvedValue({ idAliment: 1 }),
    findAll: jest.fn().mockResolvedValue([{ idAliment: 1 }]),
    findOne: jest.fn().mockResolvedValue({ idAliment: 1 }),
    update: jest.fn().mockResolvedValue({ idAliment: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AlimentsController],
      providers: [{ provide: AlimentsService, useValue: alimentsServiceMock }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /aliments should return 201', () =>
    request(app.getHttpServer())
      .post('/aliments')
      .send({ nom: 'Pomme' })
      .expect(201));

  it('GET /aliments should return 200', () =>
    request(app.getHttpServer()).get('/aliments').expect(200));

  it('GET /aliments/:id should return 200', () =>
    request(app.getHttpServer()).get('/aliments/1').expect(200));

  it('PATCH /aliments/:id should return 200', () =>
    request(app.getHttpServer())
      .patch('/aliments/1')
      .send({ nom: 'Banane' })
      .expect(200));

  it('DELETE /aliments/:id should return 200', () =>
    request(app.getHttpServer()).delete('/aliments/1').expect(200));
});
