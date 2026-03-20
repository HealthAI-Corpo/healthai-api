import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNumberString,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUtilisateurDto {
  @ApiProperty({ example: 'Dupont', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  nom: string;

  @ApiProperty({ example: 'Marie', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  prenom: string;

  @ApiProperty({ example: 'marie.dupont@example.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: '1995-05-14',
    description: 'Format ISO date (YYYY-MM-DD)',
  })
  @IsDateString()
  dateNaissance: string;

  @ApiProperty({ example: 'Femme', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  genre: string;

  @ApiProperty({ example: 'Perte de poids', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  objectifPrincipal: string;

  @ApiProperty({ example: '72.50', description: 'Valeur décimale en kg' })
  @IsNumberString()
  poidsActuel: string;

  @ApiProperty({ example: 168, minimum: 1 })
  @IsInt()
  @Min(1)
  tailleCm: number;

  @ApiProperty({ example: 'Freemium', enum: ['Freemium', 'Premium'] })
  @IsIn(['Freemium', 'Premium'])
  typeAbonnement: 'Freemium' | 'Premium';

  @ApiProperty({
    example: '$2b$10$hash...',
    description: 'Mot de passe déjà hashé',
  })
  @IsString()
  motDePasseHash: string;
}
