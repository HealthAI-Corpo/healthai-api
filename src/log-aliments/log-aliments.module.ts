import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Aliment } from '../database/entities/aliment.entity';
import { LogAliment } from '../database/entities/log-aliment.entity';
import { Utilisateur } from '../database/entities/utilisateur.entity';
import { LogAlimentsController } from './log-aliments.controller';
import { LogAlimentsService } from './log-aliments.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogAliment, Aliment, Utilisateur])],
  controllers: [LogAlimentsController],
  providers: [LogAlimentsService],
})
export class LogAlimentsModule {}
