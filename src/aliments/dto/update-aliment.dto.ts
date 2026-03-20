import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAlimentDto {
  @ApiPropertyOptional({ example: 'Banane', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nom?: string;

  @ApiPropertyOptional({ example: '89.0' })
  @IsOptional()
  @IsNumberString()
  calories?: string;

  @ApiPropertyOptional({ example: '1.1' })
  @IsOptional()
  @IsNumberString()
  proteines?: string;

  @ApiPropertyOptional({ example: '0.3' })
  @IsOptional()
  @IsNumberString()
  lipides?: string;

  @ApiPropertyOptional({ example: '23.0' })
  @IsOptional()
  @IsNumberString()
  glucides?: string;

  @ApiPropertyOptional({ example: '1 portion', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  uniteMesure?: string;
}
