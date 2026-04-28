import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { ClientIdGuard } from './auth/guards/client-id.guard';
import { envValidationSchema } from './config/env.validation';
import { buildTypeOrmOptions } from './database/typeorm.config';
import { HealthController } from './health/health.controller';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';

// Modules métier
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { AlimentModule } from './modules/aliment/aliment.module';
import { ExerciceModule } from './modules/exercice/exercice.module';
import { LogAlimentModule } from './modules/log-aliment/log-aliment.module';
import { LogSeanceModule } from './modules/log-seance/log-seance.module';
import { LogSanteModule } from './modules/log-sante/log-sante.module';
import { ProfilSanteModule } from './modules/profil-sante/profil-sante.module';

// Modules datasets
import { RecommandationsRegimeModule } from './modules/datasets/recommandations-regime/recommandations-regime.module';
import { HistoriqueSeanceExerciceModule } from './modules/datasets/historique-seance-exercice/historique-seance-exercice.module';
import { EtlLogModule } from './modules/etl-log/etl-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('RATE_LIMIT_TTL_MS', 60_000),
          limit: configService.get<number>('RATE_LIMIT_MAX', 100),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    RabbitMqModule,
    TerminusModule,
    AuthModule,
    // Modules métier
    UtilisateurModule,
    AlimentModule,
    ExerciceModule,
    LogAlimentModule,
    LogSeanceModule,
    LogSanteModule,
    ProfilSanteModule,
    // Modules datasets
    RecommandationsRegimeModule,
    HistoriqueSeanceExerciceModule,
    EtlLogModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ClientIdGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
