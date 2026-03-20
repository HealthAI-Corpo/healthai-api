import {
  IsInt,
  IsNumberString,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogAlimentDto {
  @ApiProperty({ example: 'Petit-déjeuner', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  repas: string;

  @ApiProperty({ example: '150.00', description: 'Quantité en grammes' })
  @IsNumberString()
  quantiteG: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  idAliment: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  idUtilisateur: number;
}
