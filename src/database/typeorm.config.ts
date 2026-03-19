import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '../auth/entities/user.entity';

export function buildTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: configService.getOrThrow<string>('DATABASE_URL'),
    entities: [User],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    migrations: [
      'src/database/migrations/*.ts',
      'dist/database/migrations/*.js',
    ],
  };
}
