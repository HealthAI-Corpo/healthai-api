import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Length,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLogSeanceDto {
  @ApiProperty({ example: '2024-01-15T18:00:00Z' })
  @IsDateString()
  logDate: Date;

  @ApiPropertyOptional({ example: 'Cardio' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  typeSeance?: string;

  @ApiPropertyOptional({ example: 45.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(9999.9)
  dureeMinutes?: number;

  @ApiPropertyOptional({ example: 320.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(99999.9)
  calorieBrulee?: number;

  @ApiPropertyOptional({ example: 145 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  bpmMoyen?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idUtilisateur: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idExercice: number;
}
