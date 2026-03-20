import { IsInt, IsNumberString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogSeanceDto {
  @ApiProperty({ example: '45.0', description: 'Durée de séance en minutes' })
  @IsNumberString()
  dureeExercice: string;

  @ApiProperty({ example: '320.5', description: 'Calories brûlées' })
  @IsNumberString()
  calorieBrulee: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  idExercice: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  idUtilisateur: number;
}
