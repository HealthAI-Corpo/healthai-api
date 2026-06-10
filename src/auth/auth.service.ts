import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwksClient from 'jwks-rsa';
import * as jsonwebtoken from 'jsonwebtoken';

import { ZitadelJwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly jwksClient: jwksClient.JwksClient;
  private readonly zitadelDomain: string;

  constructor(private readonly configService: ConfigService) {
    this.zitadelDomain = configService
      .getOrThrow<string>('ZITADEL_DOMAIN')
      .replace(/\/$/, '');
    this.jwksClient = jwksClient({
      jwksUri: `${this.zitadelDomain}/oauth/v2/keys`,
      cache: true,
      cacheMaxAge: 10 * 60 * 1000,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });
  }

  // L'access token JWT Zitadel ne porte que `sub` — l'email vit dans
  // le userinfo endpoint, interrogé avec ce même token.
  async fetchUserinfoEmail(accessToken: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.zitadelDomain}/oidc/v1/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { email?: string };
      return body.email ?? null;
    } catch {
      return null;
    }
  }

  // Used by GET /auth/validate (Traefik forward-auth proxy)
  async validateToken(token: string): Promise<ZitadelJwtPayload | null> {
    try {
      const decoded = jsonwebtoken.decode(token, { complete: true });
      if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
        return null;
      }

      const signingKey = await this.jwksClient.getSigningKey(
        decoded.header.kid,
      );
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

  // Extract primary role from Zitadel's custom claim
  getPrimaryRole(payload: ZitadelJwtPayload): string {
    const roles = payload['urn:zitadel:iam:org:project:roles'];
    if (roles && typeof roles === 'object') {
      const first = Object.keys(roles)[0];
      if (first) return first;
    }
    return 'user';
  }
}
