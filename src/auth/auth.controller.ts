import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validation de token Zitadel (Traefik forward-auth)',
    description:
      'Endpoint interne appelé par Traefik avant chaque requête protégée. ' +
      'Valide le JWT Zitadel du header Authorization et injecte X-User-Id + X-User-Role ' +
      "dans la réponse pour transmission à l'upstream.",
  })
  @ApiResponse({
    status: 200,
    description: 'Token valide — headers X-User-Id et X-User-Role injectés',
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  async validate(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ valid: true }> {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or malformed Authorization header',
      );
    }
    const token = authHeader.substring(7);
    const payload = await this.authService.validateToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    res.setHeader('X-User-Id', payload.sub);
    res.setHeader('X-User-Role', this.authService.getPrimaryRole(payload));
    return { valid: true };
  }
}
