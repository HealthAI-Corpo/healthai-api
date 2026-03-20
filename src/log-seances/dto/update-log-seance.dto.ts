import { IsInt, IsNumberString, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLogSeanceDto {
  @ApiPropertyOptional({
    example: '30.0',
    description: 'Durée de séance en minutes',
  })
  @IsOptional()
  @IsNumberString()
  dureeExercice?: string;

  @ApiPropertyOptional({ example: '210.0', description: 'Calories brûlées' })
  @IsOptional()
  @IsNumberString()
  calorieBrulee?: string;

  @ApiPropertyOptional({ example: 4, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idExercice?: number;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  idUtilisateur?: number;
}
