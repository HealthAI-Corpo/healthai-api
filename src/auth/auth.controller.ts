import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description:
      'Authentification par email et mot de passe. Retourne un JWT token à utiliser dans les headers Authorization pour les requêtes protégées.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      exemple1: {
        summary: 'Compte de développement',
        value: {
          email: 'dev-admin@healthai.local',
          password: 'ChangeMe123!dev-account',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides',
  })
  @ApiResponse({
    status: 400,
    description: 'Données de requête invalides',
  })
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('validate')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validation de token (Traefik forward-auth)',
    description:
      "Endpoint interne appelé par Traefik avant chaque requête protégée. " +
      "Valide le JWT du header Authorization et injecte X-User-Id + X-User-Role " +
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
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }
    const token = authHeader.substring(7);
    const payload = await this.authService.validateToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    res.setHeader('X-User-Id', String(payload.sub));
    res.setHeader('X-User-Role', 'user');
    return { valid: true };
  }
}
