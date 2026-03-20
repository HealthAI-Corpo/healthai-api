import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLogAlimentDto {
  @ApiPropertyOptional({ example: 'Déjeuner', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  repas?: string;

  @ApiPropertyOptional({
    example: '220.50',
    description: 'Quantité en grammes',
  })
  @IsOptional()
  @IsNumberString()
  quantiteG?: string;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idAliment?: number;

  @ApiPropertyOptional({ example: 3, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idUtilisateur?: number;
}
