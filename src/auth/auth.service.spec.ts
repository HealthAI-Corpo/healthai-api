import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';

jest.mock('jwks-rsa', () =>
  jest.fn(() => ({
    getSigningKey: jest.fn(),
  })),
);

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      ZITADEL_ISSUER: 'https://issuer.example.com',
      ZITADEL_AUDIENCE: 'healthai-api',
    };
    return values[key] ?? 'default';
  }),
  get: jest.fn().mockReturnValue(undefined),
};

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPrimaryRole', () => {
    it('returns first Zitadel role when present', () => {
      const role = service.getPrimaryRole({
        sub: 'user-1',
        'urn:zitadel:iam:org:project:roles': {
          admin: true,
          editor: true,
        },
      });

      expect(role).toBe('admin');
    });

    it('returns user when roles are missing', () => {
      const role = service.getPrimaryRole({ sub: 'user-1' });
      expect(role).toBe('user');
    });
  });
});
