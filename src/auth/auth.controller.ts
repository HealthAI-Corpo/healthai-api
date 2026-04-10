import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Auth health check' })
  @ApiResponse({ status: 200, description: 'Auth module opérationnel' })
  health() {
    return { status: 'ok', provider: 'zitadel' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Retourne le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur ZITADEL' })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  me(@Req() req: { user: { userId: string; email?: string } }) {
    return req.user;
  }
}
