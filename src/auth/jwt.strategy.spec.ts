import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtStrategy, ZitadelJwtPayload } from './jwt.strategy';

// passportJwtSecret makes no network calls at construction — mock to isolate from JWKS
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
  default: jest.fn().mockReturnValue({ getSigningKey: jest.fn() }),
}));

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

const validPayload: ZitadelJwtPayload = {
  sub: 'zitadel-uuid-123',
  email: 'jane@example.com',
  iss: 'https://example.zitadel.cloud',
  aud: 'healthai-api',
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
  'urn:zitadel:iam:org:project:roles': { admin: {} },
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
    it('should return the Zitadel JWT payload as-is', () => {
      const result = strategy.validate(validPayload);
      expect(result).toEqual(validPayload);
    });

    it('should return payload without roles when roles are absent', () => {
      const payloadNoRoles: ZitadelJwtPayload = {
        sub: 'zitadel-uuid-456',
        email: 'user@example.com',
        iss: 'https://example.zitadel.cloud',
        aud: 'healthai-api',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };
      const result = strategy.validate(payloadNoRoles);
      expect(result).toEqual(payloadNoRoles);
    });

    it('should expose sub as the Zitadel user ID', () => {
      const result = strategy.validate(validPayload);
      expect(result.sub).toBe('zitadel-uuid-123');
    });
  });
});
