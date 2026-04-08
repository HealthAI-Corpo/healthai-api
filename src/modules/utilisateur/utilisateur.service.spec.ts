import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProfilSante } from '../profil-sante/entities/profil-sante.entity';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { UtilisateurService } from './utilisateur.service';

const mockUtilisateur: Utilisateur = {
  idUtilisateur: 1,
  nom: 'Doe',
  prenom: 'Jane',
  email: 'jane@example.com',
  dateDeNaissance: new Date('1990-01-01'),
  genre: 'F',
  typeAbonnement: 'Freemium',
  dateInscription: new Date('2024-01-01'),
  motDePasseHash: 'hashed',
  logsAliment: [],
  logsSeance: [],
  logsSante: [],
  profilSante: {} as unknown as ProfilSante,
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('UtilisateurService', () => {
  let service: UtilisateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilisateurService,
        { provide: getRepositoryToken(Utilisateur), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UtilisateurService>(UtilisateurService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return an array of utilisateurs', async () => {
      mockRepo.find.mockResolvedValue([mockUtilisateur]);
      const result = await service.findAll();
      expect(result).toEqual([mockUtilisateur]);
      expect(mockRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an utilisateur when found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUtilisateur);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUtilisateur);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { idUtilisateur: 1 },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new utilisateur', async () => {
      const dto: CreateUtilisateurDto = {
        nom: 'Doe',
        prenom: 'John',
        email: 'john@example.com',
        motDePasseHash: 'hash',
      };
      mockRepo.create.mockReturnValue({ ...mockUtilisateur, ...dto });
      mockRepo.save.mockResolvedValue({ ...mockUtilisateur, ...dto });

      const result = await service.create(dto);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(result.nom).toBe('Doe');
    });
  });

  describe('update', () => {
    it('should update and return the utilisateur', async () => {
      const dto: UpdateUtilisateurDto = { nom: 'Smith' };
      const updated = { ...mockUtilisateur, nom: 'Smith' };
      mockRepo.findOne.mockResolvedValue(mockUtilisateur);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result.nom).toBe('Smith');
    });

    it('should throw NotFoundException when utilisateur does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const dto: UpdateUtilisateurDto = { nom: 'X' };
      await expect(service.update(999, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the utilisateur', async () => {
      mockRepo.findOne.mockResolvedValue(mockUtilisateur);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockUtilisateur);
    });

    it('should throw NotFoundException when utilisateur does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
