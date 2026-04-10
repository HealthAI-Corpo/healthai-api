import { PartialType } from '@nestjs/swagger';
import { CreateEtlLogDto } from './create-etl-log.dto';

export class UpdateEtlLogDto extends PartialType(CreateEtlLogDto) {}
