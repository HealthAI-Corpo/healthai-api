import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwksClient from 'jwks-rsa';
import * as jsonwebtoken from 'jsonwebtoken';

import { ZitadelJwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly jwksClient: jwksClient.JwksClient;

  constructor(private readonly configService: ConfigService) {
    const domain = configService.getOrThrow<string>('ZITADEL_DOMAIN').replace(/\/$/, '');
    this.jwksClient = jwksClient({
      jwksUri: `${domain}/oauth/v2/keys`,
      cache: true,
      cacheMaxAge: 10 * 60 * 1000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });
  }

  // Used by GET /auth/validate (Traefik forward-auth proxy)
  async validateToken(token: string): Promise<ZitadelJwtPayload | null> {
    try {
      const decoded = jsonwebtoken.decode(token, { complete: true });
      if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
        return null;
      }

      const signingKey = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = signingKey.getPublicKey();

      const payload = jsonwebtoken.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: this.configService.getOrThrow<string>('JWT_ISSUER'),
        audience: this.configService.getOrThrow<string>('JWT_AUDIENCE'),
      }) as ZitadelJwtPayload;

      return payload;
    } catch {
      return null;
    }
  }
}
