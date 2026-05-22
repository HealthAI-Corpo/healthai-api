import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsIn,
  Length,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const NIVEAUX_SPORTIFS = ['débutant', 'intermédiaire', 'avancé'] as const;
export const OBJECTIFS_SPORTIFS = ['endurance', 'force', 'perte de poids', 'bien-être'] as const;

export class CreateProfilSanteDto {
  @ApiPropertyOptional({ example: 75.5 })
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

  @ApiPropertyOptional({ example: 24.7 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  imc?: number;

  @ApiPropertyOptional({ example: 'Modéré' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  niveauActivite?: string;

  @ApiPropertyOptional({ example: 'Diabète type 2' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  typeMaladie?: string;

  @ApiPropertyOptional({ example: 'Modérée' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  severite?: string;

  @ApiPropertyOptional({ example: 'Sans gluten, végétarien' })
  @IsOptional()
  @IsString()
  restrictionsAlimentaires?: string;

  @ApiPropertyOptional({ example: 'Arachides, lactose' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Perte de poids' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  objectifPrincipal?: string;

  @ApiPropertyOptional({ example: 'Débutant' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  experienceSportive?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(30)
  frequenceEntrainement?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idUtilisateur: number;

  // Champs sportifs US-2
  @ApiProperty({ example: 'débutant', enum: NIVEAUX_SPORTIFS })
  @IsString()
  @IsIn(NIVEAUX_SPORTIFS)
  niveauSportif: string;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(10)
  @Max(120)
  age?: number;

  @ApiPropertyOptional({ example: 'endurance', enum: OBJECTIFS_SPORTIFS })
  @IsOptional()
  @IsString()
  @IsIn(OBJECTIFS_SPORTIFS)
  objectifSportif?: string;

  @ApiPropertyOptional({ example: 'Haltères, tapis de course' })
  @IsOptional()
  @IsString()
  equipementDisponible?: string;

  @ApiPropertyOptional({ example: 58, description: 'Rythme cardiaque au repos (bpm)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(30)
  @Max(150)
  hrRest?: number;

  @ApiPropertyOptional({ example: 195, description: 'Rythme cardiaque max (bpm)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(60)
  @Max(250)
  hrMax?: number;

  @ApiPropertyOptional({ example: 140, description: 'Rythme cardiaque moyen à l\'effort (bpm)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(30)
  @Max(250)
  hrAvg?: number;

  @ApiPropertyOptional({ example: 18.5, description: '% de masse grasse' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(70)
  bodyFatPct?: number;
}
