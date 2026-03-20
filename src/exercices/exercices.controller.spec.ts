import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { ExercicesController } from './exercices.controller';
import { ExercicesService } from './exercices.service';

describe('ExercicesController', () => {
  let app: INestApplication<App>;
  const exercicesServiceMock = {
    create: jest.fn().mockResolvedValue({ idExercice: 1 }),
    findAll: jest.fn().mockResolvedValue([{ idExercice: 1 }]),
    findOne: jest.fn().mockResolvedValue({ idExercice: 1 }),
    update: jest.fn().mockResolvedValue({ idExercice: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ExercicesController],
      providers: [
        { provide: ExercicesService, useValue: exercicesServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /exercices should return 201', () =>
    request(app.getHttpServer())
      .post('/exercices')
      .send({ nom: 'Course', caloriesParMinute: 10 })
      .expect(201));

  it('GET /exercices should return 200', () =>
    request(app.getHttpServer()).get('/exercices').expect(200));

  it('GET /exercices/:id should return 200', () =>
    request(app.getHttpServer()).get('/exercices/1').expect(200));

  it('PATCH /exercices/:id should return 200', () =>
    request(app.getHttpServer())
      .patch('/exercices/1')
      .send({ nom: 'Velo' })
      .expect(200));

  it('DELETE /exercices/:id should return 200', () =>
    request(app.getHttpServer()).delete('/exercices/1').expect(200));
});
