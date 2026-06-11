import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface ZitadelJwtPayload {
  sub: string;
  // Absent des access tokens JWT Zitadel — récupéré via userinfo si besoin
  email?: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  'urn:zitadel:iam:org:project:roles'?: Record<string, unknown>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const domain = configService
      .getOrThrow<string>('ZITADEL_DOMAIN')
      .replace(/\/$/, '');
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

  validate(payload: ZitadelJwtPayload): ZitadelJwtPayload {
    // JWT signature already verified by Passport — return Zitadel payload as-is.
    // req.user will contain: { sub, email, iss, aud, exp, iat, roles }
    return payload;
  }
}
