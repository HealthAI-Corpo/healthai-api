import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciceDto {
  @ApiProperty({ example: 'Pompes' })
  @IsString()
  @Length(1, 150)
  nom: string;

  @ApiPropertyOptional({ example: 'Musculation' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  typeExercice?: string;

  @ApiPropertyOptional({ example: 'Pectoraux, Triceps' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  musclesPrincipaux?: string;

  @ApiPropertyOptional({ example: 'Deltoïdes' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  musclesSecondaires?: string;

  @ApiPropertyOptional({ example: 'Poids du corps' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  equipement?: string;

  @ApiPropertyOptional({ example: 'Moyen' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  difficulte?: string;

  @ApiPropertyOptional({
    example: 'Allongez-vous face au sol, mains à plat au niveau des épaules...',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}
