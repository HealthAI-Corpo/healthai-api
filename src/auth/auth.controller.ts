import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

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
}
