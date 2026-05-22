import {
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

export class CreateProfilSanteDto {
  @ApiPropertyOptional({ example: 75.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999.99)
  poidsKg?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  tailleCm?: number;

  @ApiPropertyOptional({ example: 24.7 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  imc?: number;

  @ApiPropertyOptional({ example: 'Modéré' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  niveauActivite?: string;

  @ApiPropertyOptional({ example: 'Diabète type 2' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  typeMaladie?: string;

  @ApiPropertyOptional({ example: 'Modérée' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  severite?: string;

  @ApiPropertyOptional({ example: 'Sans gluten, végétarien' })
  @IsOptional()
  @IsString()
  restrictionsAlimentaires?: string;

  @ApiPropertyOptional({ example: 'Arachides, lactose' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Perte de poids' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  objectifPrincipal?: string;

  @ApiPropertyOptional({ example: 'Débutant' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  experienceSportive?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(30)
  frequenceEntrainement?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  idUtilisateur: number;
}
