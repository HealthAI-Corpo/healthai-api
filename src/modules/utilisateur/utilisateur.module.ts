import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { Utilisateur } from './entities/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur]), AuthModule],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
  exports: [UtilisateurService],
})
export class UtilisateurModule {}
