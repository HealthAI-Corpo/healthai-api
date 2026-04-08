import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProfilSante } from '../modules/profil-sante/entities/profil-sante.entity';
import { Utilisateur } from '../modules/utilisateur/entities/utilisateur.entity';
import { JwtStrategy } from './jwt.strategy';

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

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      JWT_SECRET: 'super_secret_key_that_is_at_least_32_chars',
      JWT_ISSUER: 'healthai-api',
      JWT_AUDIENCE: 'healthai-web',
    };
    return values[key] ?? 'default';
  }),
};

const mockUtilisateurRepo = {
  findOne: jest.fn(),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: getRepositoryToken(Utilisateur),
          useValue: mockUtilisateurRepo,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validate', () => {
    it('should return id and email when user is found', async () => {
      mockUtilisateurRepo.findOne.mockResolvedValue(mockUtilisateur);

      const result = await strategy.validate({
        sub: 1,
        email: 'jane@example.com',
      });

      expect(result).toEqual({ idUtilisateur: 1, email: 'jane@example.com' });
      expect(mockUtilisateurRepo.findOne).toHaveBeenCalledWith({
        where: { idUtilisateur: 1 },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUtilisateurRepo.findOne.mockResolvedValue(null);

      await expect(
        strategy.validate({ sub: 999, email: 'nobody@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
