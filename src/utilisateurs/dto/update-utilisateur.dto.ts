import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUtilisateurDto {
  @ApiPropertyOptional({ example: 'Dupont', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nom?: string;

  @ApiPropertyOptional({ example: 'Marie', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  prenom?: string;

  @ApiPropertyOptional({ example: 'marie.dupont@example.com', maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    example: '1995-05-14',
    description: 'Format ISO date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dateNaissance?: string;

  @ApiPropertyOptional({ example: 'Femme', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  genre?: string;

  @ApiPropertyOptional({ example: 'Prise de muscle', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  objectifPrincipal?: string;

  @ApiPropertyOptional({
    example: '70.00',
    description: 'Valeur décimale en kg',
  })
  @IsOptional()
  @IsNumberString()
  poidsActuel?: string;

  @ApiPropertyOptional({ example: 172, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  tailleCm?: number;

  @ApiPropertyOptional({ example: 'Premium', enum: ['Freemium', 'Premium'] })
  @IsOptional()
  @IsIn(['Freemium', 'Premium'])
  typeAbonnement?: 'Freemium' | 'Premium';

  @ApiPropertyOptional({
    example: '$2b$10$newhash...',
    description: 'Mot de passe déjà hashé',
  })
  @IsOptional()
  @IsString()
  motDePasseHash?: string;
}
