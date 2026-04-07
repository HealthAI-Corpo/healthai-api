import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLogSanteDto {
  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  @IsDateString()
  dateLog: Date;

  @ApiPropertyOptional({ example: 75.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.99)
  poidsKg?: number;

  @ApiPropertyOptional({ example: 18.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  pourcentageGras?: number;

  @ApiPropertyOptional({ example: 22.8 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  imcActuel?: number;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  bpmMoyenJournee?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(200)
  bpmRepos?: number;

  @ApiPropertyOptional({ example: 8500 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  nbPas?: number;

  @ApiPropertyOptional({ example: 7.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(24)
  heuresSommeil?: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(20)
  hydratationLitres?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idUtilisateur: number;
}
