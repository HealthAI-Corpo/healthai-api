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

export class CreateLogAlimentDto {
  @ApiProperty({ example: '2024-01-15T12:30:00Z' })
  @IsDateString()
  logDate: Date;

  @ApiPropertyOptional({ example: 'Déjeuner' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  typeRepas?: string;

  @ApiPropertyOptional({ example: 150.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(99999.99)
  quantiteG?: number;

  @ApiPropertyOptional({ example: 'g' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  unite?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idUtilisateur: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idAliment: number;
}
