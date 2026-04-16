import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  Length,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUtilisateurDto {
  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @Length(1, 50)
  nom: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  @Length(1, 50)
  prenom: string;

  @ApiProperty({ example: 'jean.dupont@example.com' })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiProperty({ example: '1990-05-15' })
  @IsDateString()
  dateDeNaissance: Date;

  @ApiProperty({ example: 'Homme' })
  @IsString()
  @Length(1, 50)
  genre: string;

  @ApiPropertyOptional({ example: 'Premium' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  typeAbonnement?: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Length(1, 255)
  motDePasseHash: string;
}
