import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
import { EtlLog } from '../modules/etl-log/entities/etl-log.entity';

export function buildTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const migrationsRun =
    configService.get<string>('TYPEORM_RUN_MIGRATIONS', 'true') === 'true';

  return {
    type: 'postgres',
    url: configService.getOrThrow<string>('DATABASE_URL'),
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
      EtlLog,
    ],
    synchronize: false,
    migrationsRun,
    migrations: ['dist/database/migrations/*.js'],
  };
}
