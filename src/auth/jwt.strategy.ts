import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Utilisateur } from '../database/entities/utilisateur.entity';
import { JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      issuer: configService.getOrThrow<string>('JWT_ISSUER'),
      audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Pick<Utilisateur, 'idUtilisateur' | 'email'>> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { idUtilisateur: payload.sub },
    });
    if (!utilisateur) {
      throw new UnauthorizedException('Token invalid or user not found');
    }
    return {
      idUtilisateur: utilisateur.idUtilisateur,
      email: utilisateur.email,
    };
  }
}
