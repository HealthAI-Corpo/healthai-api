import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Exercice } from '../database/entities/exercice.entity';
import { ExercicesController } from './exercices.controller';
import { ExercicesService } from './exercices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exercice])],
  controllers: [ExercicesController],
  providers: [ExercicesService],
})
export class ExercicesModule {}
