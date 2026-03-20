import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { UtilisateursController } from './utilisateurs.controller';
import { UtilisateursService } from './utilisateurs.service';

describe('UtilisateursController', () => {
  let app: INestApplication<App>;
  const utilisateursServiceMock = {
    create: jest.fn().mockResolvedValue({ idUtilisateur: 1 }),
    findAll: jest.fn().mockResolvedValue([{ idUtilisateur: 1 }]),
    findOne: jest.fn().mockResolvedValue({ idUtilisateur: 1 }),
    update: jest.fn().mockResolvedValue({ idUtilisateur: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UtilisateursController],
      providers: [
        { provide: UtilisateursService, useValue: utilisateursServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /utilisateurs should return 201', () =>
    request(app.getHttpServer())
      .post('/utilisateurs')
      .send({ email: 'user@example.com' })
      .expect(201));

  it('GET /utilisateurs should return 200', () =>
    request(app.getHttpServer()).get('/utilisateurs').expect(200));

  it('GET /utilisateurs/:id should return 200', () =>
    request(app.getHttpServer()).get('/utilisateurs/1').expect(200));

  it('PATCH /utilisateurs/:id should return 200', () =>
    request(app.getHttpServer())
      .patch('/utilisateurs/1')
      .send({ nom: 'Doe' })
      .expect(200));

  it('DELETE /utilisateurs/:id should return 200', () =>
    request(app.getHttpServer()).delete('/utilisateurs/1').expect(200));
});
