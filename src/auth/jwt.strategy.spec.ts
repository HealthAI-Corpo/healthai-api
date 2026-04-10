import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

// Mock jwks-rsa so the constructor doesn't attempt JWKS HTTP calls
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
}));

import { JwtStrategy } from './jwt.strategy';

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      ZITADEL_ISSUER: 'https://zitadel.example.com',
    };
    return values[key] ?? 'default';
  }),
  get: jest.fn((key: string) => {
    if (key === 'ZITADEL_JWKS_URI') return undefined;
    return undefined;
  }),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validate', () => {
    it('should return userId and email when sub is present', async () => {
      const result = await strategy.validate({
        sub: 'zitadel-user-id',
        iss: 'https://zitadel.example.com',
        aud: 'healthai-api',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        email: 'jane@example.com',
      });

      expect(result).toEqual({ userId: 'zitadel-user-id', email: 'jane@example.com' });
    });

    it('should return userId without email when email is absent', async () => {
      const result = await strategy.validate({
        sub: 'zitadel-user-id',
        iss: 'https://zitadel.example.com',
        aud: 'healthai-api',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      expect(result).toEqual({ userId: 'zitadel-user-id', email: undefined });
    });

    it('should throw UnauthorizedException when sub is missing', async () => {
      await expect(
        strategy.validate({
          sub: '',
          iss: 'https://zitadel.example.com',
          aud: 'healthai-api',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
