import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Exercice } from '../database/entities/exercice.entity';
import { LogSeance } from '../database/entities/log-seance.entity';
import { Utilisateur } from '../database/entities/utilisateur.entity';
import { LogSeancesController } from './log-seances.controller';
import { LogSeancesService } from './log-seances.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogSeance, Exercice, Utilisateur])],
  controllers: [LogSeancesController],
  providers: [LogSeancesService],
})
export class LogSeancesModule {}
