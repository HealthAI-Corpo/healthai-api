import { PartialType } from '@nestjs/swagger';
import { CreateHistoriqueSeanceExerciceDto } from './create-historique-seance-exercice.dto';

export class UpdateHistoriqueSeanceExerciceDto extends PartialType(
  CreateHistoriqueSeanceExerciceDto,
) {}
