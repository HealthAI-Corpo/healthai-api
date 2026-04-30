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
    summary: 'Token validation (Traefik forward-auth)',
    description:
      'Internal endpoint called by Traefik before each protected request. ' +
      'Validates the Zitadel JWT from the Authorization header and injects ' +
      'X-User-Id + X-User-Role headers for the upstream service.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token valid — X-User-Id and X-User-Role headers injected',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
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
