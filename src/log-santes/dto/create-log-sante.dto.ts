import { IsInt, IsNumberString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogSanteDto {
  @ApiProperty({ example: '71.80', description: 'Poids en kg' })
  @IsNumberString()
  poidsKg: string;

  @ApiProperty({ example: '72.0', description: 'Moyenne BPM' })
  @IsNumberString()
  moyenneBpm: string;

  @ApiProperty({ example: '7.50', description: 'Heures de sommeil' })
  @IsNumberString()
  heuresSommeil: string;

  @ApiPropertyOptional({ example: 9500, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  nbPas?: number;

  @ApiPropertyOptional({ example: 68, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  frequenceCardiaque?: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  idUtilisateur: number;
}
