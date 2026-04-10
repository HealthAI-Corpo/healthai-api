import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface ZitadelJwtPayload {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  email?: string;
  name?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const zitadelIssuer = configService.getOrThrow<string>('ZITADEL_ISSUER');
    const jwksUri =
      configService.get<string>('ZITADEL_JWKS_URI') ??
      `${zitadelIssuer}/oauth/v2/keys`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
      issuer: zitadelIssuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: ZitadelJwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token invalide : sub manquant');
    }
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
