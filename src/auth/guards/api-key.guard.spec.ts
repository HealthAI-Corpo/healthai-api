import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ApiKeyGuard } from './api-key.guard';

const VALID_API_KEY = 'test-api-key-secret';

function buildContext(
  isPublicHandler: boolean,
  apiKeyHeader?: string,
): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        url: '/api/some-endpoint',
        headers: apiKeyHeader ? { 'x-api-key': apiKeyHeader } : {},
      }),
    }),
    // reflector mock is injected separately; these are used by reflector
    _isPublicHandler: isPublicHandler,
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(VALID_API_KEY),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the handler is decorated with @Public()', () => {
    it('should return true without checking the API key', () => {
      reflector.getAllAndOverride.mockImplementation((key) => {
        if (key === IS_PUBLIC_KEY) return true;
        return undefined;
      });

      const ctx = buildContext(true);
      const result = guard.canActivate(ctx);

      expect(result).toBe(true);
    });
  });

  describe('when the handler is not decorated with @Public()', () => {
    beforeEach(() => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
    });

    it('should return true when a valid x-api-key is provided', () => {
      const ctx = buildContext(false, VALID_API_KEY);
      const result = guard.canActivate(ctx);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when x-api-key is missing', () => {
      const ctx = buildContext(false);

      expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when x-api-key is invalid', () => {
      const ctx = buildContext(false, 'wrong-api-key');

      expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
    });
  });
});
