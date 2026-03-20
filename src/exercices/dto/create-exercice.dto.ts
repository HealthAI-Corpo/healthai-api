import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciceDto {
  @ApiProperty({ example: 'Squat', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  nom: string;

  @ApiProperty({ example: 'Musculation', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  typeExercice: string;

  @ApiPropertyOptional({ example: 'Quadriceps', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  muscleCible?: string;

  @ApiPropertyOptional({ example: 'Barre olympique', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  equipement?: string;

  @ApiPropertyOptional({ example: 'Intermédiaire', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  difficulte?: string;

  @ApiPropertyOptional({ example: '3 séries de 10 répétitions' })
  @IsOptional()
  @IsString()
  instructions?: string;
}
