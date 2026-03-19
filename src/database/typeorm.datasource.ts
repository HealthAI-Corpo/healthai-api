import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../auth/entities/user.entity';

config({ path: '.env.local' });
config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for TypeORM DataSource');
}

const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [User],
  migrations: ['src/database/migrations/*.ts', 'dist/database/migrations/*.js'],
});

export default AppDataSource;
