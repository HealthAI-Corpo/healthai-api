import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { Aliment } from './entities/aliment.entity';
import { Exercice } from './entities/exercice.entity';
import { LogAliment } from './entities/log-aliment.entity';
import { LogSante } from './entities/log-sante.entity';
import { LogSeance } from './entities/log-seance.entity';
import { Utilisateur } from './entities/utilisateur.entity';

config({ path: '.env.local' });
config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for TypeORM DataSource');
}

const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [Utilisateur, Aliment, Exercice, LogAliment, LogSeance, LogSante],
  migrations: ['src/database/migrations/*.ts', 'dist/database/migrations/*.js'],
});

export default AppDataSource;
