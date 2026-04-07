import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRecommandationsRegimeDto {
  @ApiProperty({ example: 'REC001' })
  @IsString()
  idDatasetRecommandationsRegime: string;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(150)
  age?: number;

  @ApiPropertyOptional({ example: 'Homme' })
  @IsOptional()
  @IsString()
  sexe?: string;

  @ApiPropertyOptional({ example: 80.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.99)
  poidsKg?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  tailleCm?: number;

  @ApiPropertyOptional({ example: 'Diabète type 2' })
  @IsOptional()
  @IsString()
  typeMaladie?: string;

  @ApiPropertyOptional({ example: 'Modérée' })
  @IsOptional()
  @IsString()
  gravite?: string;

  @ApiPropertyOptional({ example: 'Modéré' })
  @IsOptional()
  @IsString()
  niveauActivitePhysique?: string;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  apportCaloriqueJournalier?: number;

  @ApiPropertyOptional({ example: 180.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  cholesterolMgDl?: number;

  @ApiPropertyOptional({ example: 120.8 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  tensionArterielleMMHg?: number;

  @ApiPropertyOptional({ example: 95.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  glucoseMgDl?: number;

  @ApiPropertyOptional({ example: 'Sans gluten' })
  @IsOptional()
  @IsString()
  restrictionsAlimentaires?: string;

  @ApiPropertyOptional({ example: 'Arachides' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Méditerranéenne' })
  @IsOptional()
  @IsString()
  cuisinePreferee?: string;

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  heuresExerciceSemaine?: number;

  @ApiPropertyOptional({ example: 0.75 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(1)
  adherenceRegime?: number;

  @ApiPropertyOptional({ example: 2.3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  scoreDesequilibreNutriment?: number;

  @ApiPropertyOptional({ example: 'Régime méditerranéen' })
  @IsOptional()
  @IsString()
  recommandationRegime?: string;
}
