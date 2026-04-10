import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateAlimentDto } from './dto/create-aliment.dto';
import { UpdateAlimentDto } from './dto/update-aliment.dto';
import { Aliment } from './entities/aliment.entity';
import { AlimentService } from './aliment.service';

const mockAliment: Aliment = {
  idAliment: 1,
  nom: 'Pomme',
  categorie: 'Fruit',
  typeRepas: 'Collation',
  calories: 52,
  proteines: 0.3,
  lipides: 0.2,
  glucides: 14,
  fibres: 2.4,
  sucres: 10,
  sodiumMg: 1,
  cholesterolMg: 0,
  uniteMesure: '100g',
  logsAliment: [],
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('AlimentService', () => {
  let service: AlimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlimentService,
        { provide: getRepositoryToken(Aliment), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AlimentService>(AlimentService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return an array of aliments', async () => {
      mockRepo.find.mockResolvedValue([mockAliment]);
      const result = await service.findAll();
      expect(result).toEqual([mockAliment]);
      expect(mockRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no aliments', async () => {
      mockRepo.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an aliment when found', async () => {
      mockRepo.findOne.mockResolvedValue(mockAliment);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAliment);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { idAliment: 1 } });
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new aliment', async () => {
      const dto: CreateAlimentDto = { nom: 'Banane', calories: 89 };
      mockRepo.create.mockReturnValue({ ...mockAliment, ...dto });
      mockRepo.save.mockResolvedValue({ ...mockAliment, ...dto });

      const result = await service.create(dto);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(result.nom).toBe('Banane');
      expect(result.calories).toBe(89);
    });
  });

  describe('update', () => {
    it('should update and return the aliment', async () => {
      const dto: UpdateAlimentDto = { nom: 'Pomme golden', calories: 55 };
      const updated = { ...mockAliment, ...dto };
      mockRepo.findOne.mockResolvedValue(mockAliment);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result.nom).toBe('Pomme golden');
      expect(result.calories).toBe(55);
    });

    it('should throw NotFoundException when aliment does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update(999, { nom: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the aliment', async () => {
      mockRepo.findOne.mockResolvedValue(mockAliment);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockAliment);
    });

    it('should throw NotFoundException when aliment does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
