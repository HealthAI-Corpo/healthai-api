import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilSanteService } from './profil-sante.service';
import { ProfilSanteController } from './profil-sante.controller';
import { ProfilSante } from './entities/profil-sante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfilSante])],
  controllers: [ProfilSanteController],
  providers: [ProfilSanteService],
  exports: [ProfilSanteService],
})
export class ProfilSanteModule {}
