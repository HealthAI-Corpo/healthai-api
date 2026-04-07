import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Entités métier
import { Utilisateur } from '../modules/utilisateur/entities/utilisateur.entity';
import { Aliment } from '../modules/aliment/entities/aliment.entity';
import { Exercice } from '../modules/exercice/entities/exercice.entity';
import { LogAliment } from '../modules/log-aliment/entities/log-aliment.entity';
import { LogSeance } from '../modules/log-seance/entities/log-seance.entity';
import { LogSante } from '../modules/log-sante/entities/log-sante.entity';
import { ProfilSante } from '../modules/profil-sante/entities/profil-sante.entity';

// Entités datasets
import { RecommandationsRegime } from '../modules/datasets/recommandations-regime/entities/recommandations-regime.entity';
import { HistoriqueSeanceExercice } from '../modules/datasets/historique-seance-exercice/entities/historique-seance-exercice.entity';

config({ path: '.env.local' });
config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for TypeORM DataSource');
}

const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [
    // Entités métier
    Utilisateur,
    Aliment,
    Exercice,
    LogAliment,
    LogSeance,
    LogSante,
    ProfilSante,
    // Entités datasets
    RecommandationsRegime,
    HistoriqueSeanceExercice,
  ],
  migrations: ['src/database/migrations/*.ts', 'dist/database/migrations/*.js'],
});

export default AppDataSource;
