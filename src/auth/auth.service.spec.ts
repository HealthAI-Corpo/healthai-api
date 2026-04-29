import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as jsonwebtoken from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { AuthService } from './auth.service';

jest.mock('jwks-rsa');
jest.mock('jsonwebtoken');

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      ZITADEL_DOMAIN: 'https://example.zitadel.cloud',
      JWT_ISSUER: 'https://example.zitadel.cloud',
      JWT_AUDIENCE: 'healthai-api',
    };
    return values[key] ?? 'default_value';
  }),
};

const mockGetSigningKey = jest.fn();
const mockGetPublicKey = jest.fn().mockReturnValue('public-key');
mockGetSigningKey.mockResolvedValue({ getPublicKey: mockGetPublicKey });

const mockJwksClientInstance = { getSigningKey: mockGetSigningKey };
(jwksClient as jest.Mock).mockReturnValue(mockJwksClientInstance);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validateToken', () => {
    const validPayload = {
      sub: 'zitadel-user-id-123',
      email: 'user@example.com',
      iss: 'https://example.zitadel.cloud',
      aud: 'healthai-api',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    };

    it('should return payload for a valid token', async () => {
      (jsonwebtoken.decode as jest.Mock).mockReturnValue({
        header: { kid: 'key-id-1', alg: 'RS256' },
        payload: validPayload,
        signature: 'sig',
      });
      (jsonwebtoken.verify as jest.Mock).mockReturnValue(validPayload);

      const result = await service.validateToken('valid.jwt.token');

      expect(result).toEqual(validPayload);
      expect(mockGetSigningKey).toHaveBeenCalledWith('key-id-1');
    });

    it('should return null when token cannot be decoded', async () => {
      (jsonwebtoken.decode as jest.Mock).mockReturnValue(null);

      const result = await service.validateToken('garbage');

      expect(result).toBeNull();
    });

    it('should return null when token has no kid', async () => {
      (jsonwebtoken.decode as jest.Mock).mockReturnValue({
        header: { alg: 'RS256' },
        payload: validPayload,
        signature: 'sig',
      });

      const result = await service.validateToken('no-kid.jwt.token');

      expect(result).toBeNull();
    });

    it('should return null when verification throws', async () => {
      (jsonwebtoken.decode as jest.Mock).mockReturnValue({
        header: { kid: 'key-id-1', alg: 'RS256' },
        payload: validPayload,
        signature: 'sig',
      });
      (jsonwebtoken.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      const result = await service.validateToken('expired.jwt.token');

      expect(result).toBeNull();
    });
  });

  describe('getPrimaryRole', () => {
    it('returns first Zitadel role when present', () => {
      const role = service.getPrimaryRole({
        sub: 'user-1',
        email: 'u@example.com',
        iss: 'https://example.zitadel.cloud',
        aud: 'healthai-api',
        exp: 9999999999,
        iat: 0,
        'urn:zitadel:iam:org:project:roles': { admin: {}, editor: {} },
      });
      expect(role).toBe('admin');
    });

    it('returns "user" when roles are missing', () => {
      const role = service.getPrimaryRole({
        sub: 'user-1',
        email: 'u@example.com',
        iss: 'https://example.zitadel.cloud',
        aud: 'healthai-api',
        exp: 9999999999,
        iat: 0,
      });
      expect(role).toBe('user');
    });
  });
});
