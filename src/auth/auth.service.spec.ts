import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

const mockUser: User = {
  id: 'test-uuid',
  email: 'user@example.com',
  password: 'hashed_password',
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed_token'),
};

const mockConfigService = {
  getOrThrow: jest
    .fn((key: string) => {
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
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access_token when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('p@ssw0rd123', 10);
      const user = { ...mockUser, password: hashedPassword };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.login({
        email: 'user@example.com',
        password: 'p@ssw0rd123',
      });

      expect(result).toEqual({ access_token: 'signed_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      }, {
        issuer: 'healthai-api',
        audience: 'healthai-web',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      const user = { ...mockUser, password: hashedPassword };
      userRepository.findOne.mockResolvedValue(user);

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return the user when found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser({
        sub: 'test-uuid',
        email: 'user@example.com',
      });

      expect(result).toEqual(mockUser);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-uuid' },
      });
    });

    it('should return null when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser({
        sub: 'nonexistent',
        email: 'no@example.com',
      });

      expect(result).toBeNull();
    });
  });
});
