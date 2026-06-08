import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { envValidationSchema } from './config/env.validation';
import { buildTypeOrmOptions } from './database/typeorm.config';
import { HealthController } from './health/health.controller';

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
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL', 60000),
            limit: configService.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
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
    // Bus de messages
    RabbitMqModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
