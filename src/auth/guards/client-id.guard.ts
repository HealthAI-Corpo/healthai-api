import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class ClientIdGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientId = request.headers['x-client-id'];
    const validClientId =
      this.configService.getOrThrow<string>('FRONTEND_CLIENT_ID');

    if (
      !clientId ||
      typeof clientId !== 'string' ||
      !this.safeCompare(clientId, validClientId)
    ) {
      throw new UnauthorizedException('Missing or invalid client identity');
    }

    return true;
  }

  private safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  }
}
