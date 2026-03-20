import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Aliment } from './entities/aliment.entity';
import { Exercice } from './entities/exercice.entity';
import { LogAliment } from './entities/log-aliment.entity';
import { LogSante } from './entities/log-sante.entity';
import { LogSeance } from './entities/log-seance.entity';
import { Utilisateur } from './entities/utilisateur.entity';

export function buildTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: configService.getOrThrow<string>('DATABASE_URL'),
    entities: [Utilisateur, Aliment, Exercice, LogAliment, LogSeance, LogSante],
    synchronize: false,
    migrationsRun: true,
    migrations: ['dist/database/migrations/*.js'],
  };
}
