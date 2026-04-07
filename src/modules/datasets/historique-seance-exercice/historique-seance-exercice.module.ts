import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueSeanceExerciceService } from './historique-seance-exercice.service';
import { HistoriqueSeanceExerciceController } from './historique-seance-exercice.controller';
import { HistoriqueSeanceExercice } from './entities/historique-seance-exercice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueSeanceExercice])],
  controllers: [HistoriqueSeanceExerciceController],
  providers: [HistoriqueSeanceExerciceService],
  exports: [HistoriqueSeanceExerciceService],
})
export class HistoriqueSeanceExerciceModule {}
