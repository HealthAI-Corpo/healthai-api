import { PartialType } from '@nestjs/swagger';
import { CreateLogSeanceDto } from './create-log-seance.dto';

export class UpdateLogSeanceDto extends PartialType(CreateLogSeanceDto) {}
