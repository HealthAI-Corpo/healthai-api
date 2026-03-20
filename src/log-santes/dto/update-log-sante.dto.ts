import { IsInt, IsNumberString, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLogSanteDto {
  @ApiPropertyOptional({ example: '69.50', description: 'Poids en kg' })
  @IsOptional()
  @IsNumberString()
  poidsKg?: string;

  @ApiPropertyOptional({ example: '70.0', description: 'Moyenne BPM' })
  @IsOptional()
  @IsNumberString()
  moyenneBpm?: string;

  @ApiPropertyOptional({ example: '8.00', description: 'Heures de sommeil' })
  @IsOptional()
  @IsNumberString()
  heuresSommeil?: string;

  @ApiPropertyOptional({ example: 12000, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  nbPas?: number;

  @ApiPropertyOptional({ example: 66, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  frequenceCardiaque?: number;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idUtilisateur?: number;
}
