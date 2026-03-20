import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { auth as betterAuth } from './better-auth/auth';
import { envValidationSchema } from './config/env.validation';
import { buildTypeOrmOptions } from './database/typeorm.config';
import { HealthController } from './health/health.controller';
import { AlimentsModule } from './aliments/aliments.module';
import { ExercicesModule } from './exercices/exercices.module';
import { LogAlimentsModule } from './log-aliments/log-aliments.module';
import { LogSantesModule } from './log-santes/log-santes.module';
import { LogSeancesModule } from './log-seances/log-seances.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    TerminusModule,
    BetterAuthModule.forRoot({
      auth: betterAuth,
      disableGlobalAuthGuard: true,
    }),
    AuthModule,
    UtilisateursModule,
    AlimentsModule,
    ExercicesModule,
    LogAlimentsModule,
    LogSeancesModule,
    LogSantesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
