import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciceService } from './exercice.service';
import { ExerciceController } from './exercice.controller';
import { Exercice } from './entities/exercice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercice])],
  controllers: [ExerciceController],
  providers: [ExerciceService],
  exports: [ExerciceService],
})
export class ExerciceModule {}
