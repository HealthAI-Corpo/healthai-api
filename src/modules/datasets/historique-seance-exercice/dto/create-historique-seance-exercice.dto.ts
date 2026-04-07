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

export class CreateHistoriqueSeanceExerciceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  idDatasetHistoriqueSeanceExercice: number;

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(150)
  age?: number;

  @ApiPropertyOptional({ example: 'Femme' })
  @IsOptional()
  @IsString()
  sexe?: string;

  @ApiPropertyOptional({ example: 68.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.99)
  poidsKg?: number;

  @ApiPropertyOptional({ example: 165 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  tailleCm?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  bpmMax?: number;

  @ApiPropertyOptional({ example: 145 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  bpmMoyen?: number;

  @ApiPropertyOptional({ example: 65 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(200)
  bpmRepos?: number;

  @ApiPropertyOptional({ example: 45.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  dureeSeanceMinutes?: number;

  @ApiPropertyOptional({ example: 350.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  caloriesBrulees?: number;

  @ApiPropertyOptional({ example: 'Course à pied' })
  @IsOptional()
  @IsString()
  typeSport?: string;

  @ApiPropertyOptional({ example: 22.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  pourcentageGras?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  consommationEauL?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(7)
  frequenceSportJourSemaine?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  niveauExperience?: number;
}
