import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable()
export class AuthService {
  private readonly issuer: string;
  private readonly audience: string;
  private readonly jwks: ReturnType<typeof jwksClient>;

  constructor(private readonly configService: ConfigService) {
    this.issuer = this.configService
      .getOrThrow<string>('ZITADEL_ISSUER')
      .replace(/\/+$/, '');
    this.audience = this.configService.getOrThrow<string>('ZITADEL_AUDIENCE');
    const jwksUri =
      this.configService.get<string>('ZITADEL_JWKS_URI') ??
      `${this.issuer}/oauth/v2/keys`;
    this.jwks = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000,
    });
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (
        !decoded ||
        typeof decoded !== 'object' ||
        typeof decoded.header?.kid !== 'string'
      ) {
        return null;
      }

      const key = await this.jwks.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const payload = jwt.verify(token, publicKey, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['RS256'],
      });

      if (!payload || typeof payload !== 'object' || !('sub' in payload)) {
        return null;
      }

      return payload as JwtPayload;
    } catch {
      return null;
    }
  }

  getPrimaryRole(payload: JwtPayload): string {
    const roles = payload['urn:zitadel:iam:org:project:roles'];
    if (roles && typeof roles === 'object') {
      const roleNames = Object.keys(roles as Record<string, unknown>);
      if (roleNames.length > 0) {
        return roleNames[0];
      }
    }
    return 'user';
  }
}
