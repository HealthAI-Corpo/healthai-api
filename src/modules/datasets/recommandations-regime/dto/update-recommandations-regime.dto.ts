import { PartialType } from '@nestjs/swagger';
import { CreateRecommandationsRegimeDto } from './create-recommandations-regime.dto';

export class UpdateRecommandationsRegimeDto extends PartialType(
  CreateRecommandationsRegimeDto,
) {}
