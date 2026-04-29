import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Repository } from 'typeorm';

import { Utilisateur } from '../modules/utilisateur/entities/utilisateur.entity';

export interface ZitadelJwtPayload {
  sub: string;
  email: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {
    const domain = configService.getOrThrow<string>('ZITADEL_DOMAIN').replace(/\/$/, '');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Fetch Zitadel's public keys from the JWKS endpoint (RS256, asymmetric)
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${domain}/oauth/v2/keys`,
      }),
      issuer: configService.getOrThrow<string>('JWT_ISSUER'),
      audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
      algorithms: ['RS256'],
    });
  }

  async validate(
    payload: ZitadelJwtPayload,
  ): Promise<Pick<Utilisateur, 'idUtilisateur' | 'email'>> {
    // Match Zitadel user to local Utilisateur record by email
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { email: payload.email },
    });
    if (!utilisateur) {
      throw new UnauthorizedException('User not provisioned in this application');
    }
    return {
      idUtilisateur: utilisateur.idUtilisateur,
      email: utilisateur.email,
    };
  }
}
