import { PartialType } from '@nestjs/swagger';
import { CreateProfilSanteDto } from './create-profil-sante.dto';

export class UpdateProfilSanteDto extends PartialType(CreateProfilSanteDto) {}
