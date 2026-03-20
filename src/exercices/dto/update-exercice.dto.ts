import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExerciceDto {
  @ApiPropertyOptional({ example: 'Pompes', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nom?: string;

  @ApiPropertyOptional({ example: 'Poids du corps', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  typeExercice?: string;

  @ApiPropertyOptional({ example: 'Pectoraux', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  muscleCible?: string;

  @ApiPropertyOptional({ example: 'Aucun', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  equipement?: string;

  @ApiPropertyOptional({ example: 'Débutant', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  difficulte?: string;

  @ApiPropertyOptional({
    example: 'Conserver le dos droit pendant le mouvement.',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}
