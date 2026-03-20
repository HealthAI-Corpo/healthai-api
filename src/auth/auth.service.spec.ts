import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Utilisateur } from '../database/entities/utilisateur.entity';
import { AuthService } from './auth.service';

const mockUtilisateur: Utilisateur = {
  idUtilisateur: 1,
  nom: 'Doe',
  prenom: 'Jane',
  email: 'user@example.com',
  dateNaissance: '1990-01-01',
  genre: 'F',
  objectifPrincipal: 'Fitness',
  poidsActuel: '70.00',
  tailleCm: 170,
  typeAbonnement: 'Freemium',
  dateInscription: new Date('2024-01-01T00:00:00.000Z'),
  motDePasseHash: 'hashed_password',
};

const mockUtilisateurRepository = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed_token'),
};

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      JWT_SECRET: 'super_secret_key_that_is_at_least_32_chars',
      JWT_ISSUER: 'healthai-api',
      JWT_AUDIENCE: 'healthai-web',
    };
    return values[key] ?? 'default_value';
  }),
  get: jest.fn().mockReturnValue('3600s'),
};

describe('AuthService', () => {
  let service: AuthService;
  let utilisateurRepository: jest.Mocked<Repository<Utilisateur>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Utilisateur),
          useValue: mockUtilisateurRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    utilisateurRepository = module.get(getRepositoryToken(Utilisateur));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access_token when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('p@ssw0rd123', 10);
      const utilisateur = {
        ...mockUtilisateur,
        motDePasseHash: hashedPassword,
      };
      utilisateurRepository.findOne.mockResolvedValue(utilisateur);

      const result = await service.login({
        email: 'user@example.com',
        password: 'p@ssw0rd123',
      });

      expect(result).toEqual({ access_token: 'signed_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: utilisateur.idUtilisateur,
          email: utilisateur.email,
        },
        {
          issuer: 'healthai-api',
          audience: 'healthai-web',
        },
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      utilisateurRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      const utilisateur = {
        ...mockUtilisateur,
        motDePasseHash: hashedPassword,
      };
      utilisateurRepository.findOne.mockResolvedValue(utilisateur);

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when stored hash is legacy plaintext', async () => {
      const utilisateur = {
        ...mockUtilisateur,
        motDePasseHash: 'legacy-password-not-set',
      };
      utilisateurRepository.findOne.mockResolvedValue(utilisateur);

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'any_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return the user when found', async () => {
      utilisateurRepository.findOne.mockResolvedValue(mockUtilisateur);

      const result = await service.validateUser({
        sub: 1,
        email: 'user@example.com',
      });

      expect(result).toEqual(mockUtilisateur);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(utilisateurRepository.findOne).toHaveBeenCalledWith({
        where: { idUtilisateur: 1 },
      });
    });

    it('should return null when user is not found', async () => {
      utilisateurRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser({
        sub: 9999,
        email: 'no@example.com',
      });

      expect(result).toBeNull();
    });
  });
});
