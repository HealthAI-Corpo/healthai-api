import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogSante } from '../database/entities/log-sante.entity';
import { Utilisateur } from '../database/entities/utilisateur.entity';
import { LogSantesController } from './log-santes.controller';
import { LogSantesService } from './log-santes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogSante, Utilisateur])],
  controllers: [LogSantesController],
  providers: [LogSantesService],
})
export class LogSantesModule {}
