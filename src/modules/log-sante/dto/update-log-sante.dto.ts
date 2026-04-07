import { PartialType } from '@nestjs/swagger';
import { CreateLogSanteDto } from './create-log-sante.dto';

export class UpdateLogSanteDto extends PartialType(CreateLogSanteDto) {}
