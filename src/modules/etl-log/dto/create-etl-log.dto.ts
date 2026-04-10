import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  Length,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StatutEtlEnum } from '../entities/etl-log.entity';

export class CreateEtlLogDto {
  @ApiProperty({ example: 'pipeline_aliment_import' })
  @IsString()
  @Length(1, 255)
  libellePipeline: string;

  @ApiProperty({ example: 'aliments_2024.csv' })
  @IsString()
  @Length(1, 255)
  fichierNom: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  nbLignesTotal?: number;

  @ApiPropertyOptional({ example: 1480 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  nbLignesValides?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  nbLignesAnomalies?: number;

  @ApiPropertyOptional({ enum: StatutEtlEnum, example: StatutEtlEnum.SUCCESS })
  @IsOptional()
  @IsEnum(StatutEtlEnum)
  statut?: StatutEtlEnum;

  @ApiPropertyOptional({ example: 'Import terminé avec succès' })
  @IsOptional()
  @IsString()
  message?: string;
}
