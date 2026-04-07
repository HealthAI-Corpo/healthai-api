import { IsString, IsOptional, IsNumber, Length, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAlimentDto {
  @ApiProperty({ example: 'Pomme' })
  @IsString()
  @Length(1, 100)
  nom: string;

  @ApiPropertyOptional({ example: 'Fruits' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  categorie?: string;

  @ApiPropertyOptional({ example: 'Collation' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  typeRepas?: string;

  @ApiPropertyOptional({ example: 52.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(99999.9)
  calories?: number;

  @ApiPropertyOptional({ example: 0.3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.9)
  proteines?: number;

  @ApiPropertyOptional({ example: 0.2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.9)
  lipides?: number;

  @ApiPropertyOptional({ example: 14.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.9)
  glucides?: number;

  @ApiPropertyOptional({ example: 2.4 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.99)
  fibres?: number;

  @ApiPropertyOptional({ example: 10.4 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.99)
  sucres?: number;

  @ApiPropertyOptional({ example: 1.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(99999.99)
  sodiumMg?: number;

  @ApiPropertyOptional({ example: 0.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(99999.99)
  cholesterolMg?: number;

  @ApiPropertyOptional({ example: 'g' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  uniteMesure?: string;
}
