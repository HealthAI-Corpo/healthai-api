import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
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
import { EtlModule } from './etl/etl.module';
import { UsersModule } from './users/users.module';
import { FoodsModule } from './foods/foods.module';
import { ExercisesModule } from './exercises/exercises.module';
import { MetricsModule } from './metrics/metrics.module';
import { AdminModule } from './admin/admin.module';
import { ExportsModule } from './exports/exports.module';

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
    AuthModule,
    EtlModule,
    UsersModule,
    FoodsModule,
    ExercisesModule,
    MetricsModule,
    AdminModule,
    ExportsModule,
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
  ],
})
export class AppModule {}
