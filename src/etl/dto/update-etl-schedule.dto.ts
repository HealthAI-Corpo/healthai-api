import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateEtlScheduleDto {
  @ApiProperty({ example: '0 0 * * *' })
  @IsString()
  cronExpression: string;
}
