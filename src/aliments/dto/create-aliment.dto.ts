import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlimentDto {
  @ApiProperty({ example: 'Pomme', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nom: string;

  @ApiProperty({ example: '52.0' })
  @IsNumberString()
  calories: string;

  @ApiProperty({ example: '0.3' })
  @IsNumberString()
  proteines: string;

  @ApiProperty({ example: '0.2' })
  @IsNumberString()
  lipides: string;

  @ApiProperty({ example: '14.0' })
  @IsNumberString()
  glucides: string;

  @ApiPropertyOptional({ example: '100g', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  uniteMesure?: string;
}
