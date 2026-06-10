import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from './jwt-auth.guard';

// Prevent AuthGuard('jwt') from attempting JWKS/network calls
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
  default: jest.fn().mockReturnValue({ getSigningKey: jest.fn() }),
}));

const mockReflector = {
  getAllAndOverride: jest.fn(),
};

const buildContext = (handler = jest.fn(), cls = class {}) =>
  ({
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({
      getRequest: () => ({ headers: { authorization: 'Bearer token' } }),
    }),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => jest.clearAllMocks());

  it('should allow access when route is marked @Public()', () => {
    mockReflector.getAllAndOverride.mockReturnValue(true);

    const result = guard.canActivate(buildContext());

    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
      expect.any(Function),
      expect.any(Function),
    ]);
  });

  it('should delegate to Passport AuthGuard when route is not @Public()', () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);

    const superCanActivate = jest
      .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
      .mockReturnValue(true);

    const result = guard.canActivate(buildContext());

    expect(superCanActivate).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should delegate to Passport AuthGuard when @Public() is not set', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    const superCanActivate = jest
      .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
      .mockReturnValue(true);

    void guard.canActivate(buildContext());

    expect(superCanActivate).toHaveBeenCalled();
  });
});
