import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProfilSante } from '../modules/profil-sante/entities/profil-sante.entity';
import { Utilisateur } from '../modules/utilisateur/entities/utilisateur.entity';
import { JwtStrategy } from './jwt.strategy';

// passportJwtSecret makes no network calls at construction — mock to isolate from JWKS
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
  default: jest.fn().mockReturnValue({ getSigningKey: jest.fn() }),
}));

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
      ZITADEL_DOMAIN: 'https://example.zitadel.cloud',
      JWT_ISSUER: 'https://example.zitadel.cloud',
      JWT_AUDIENCE: 'healthai-api',
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
        { provide: getRepositoryToken(Utilisateur), useValue: mockUtilisateurRepo },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validate', () => {
    it('should return id and email when user is found by email', async () => {
      mockUtilisateurRepo.findOne.mockResolvedValue(mockUtilisateur);

      const result = await strategy.validate({
        sub: 'zitadel-uuid-123',
        email: 'jane@example.com',
        iss: 'https://example.zitadel.cloud',
        aud: 'healthai-api',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      expect(result).toEqual({ idUtilisateur: 1, email: 'jane@example.com' });
      expect(mockUtilisateurRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'jane@example.com' },
      });
    });

    it('should throw UnauthorizedException when user is not provisioned', async () => {
      mockUtilisateurRepo.findOne.mockResolvedValue(null);

      await expect(
        strategy.validate({
          sub: 'unknown-uuid',
          email: 'nobody@example.com',
          iss: 'https://example.zitadel.cloud',
          aud: 'healthai-api',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
