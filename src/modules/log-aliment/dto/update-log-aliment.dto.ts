import { PartialType } from '@nestjs/swagger';
import { CreateLogAlimentDto } from './create-log-aliment.dto';

export class UpdateLogAlimentDto extends PartialType(CreateLogAlimentDto) {}
