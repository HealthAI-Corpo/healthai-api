import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Headers,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { ZitadelJwtPayload } from '../../auth/jwt.strategy';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

@ApiTags('utilisateurs')
@ApiBearerAuth('JWT-auth')
@Controller('utilisateurs')
export class UtilisateurController {
  constructor(
    private readonly utilisateurService: UtilisateurService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description: 'Crée un nouvel utilisateur avec mot de passe hashé',
  })
  @ApiBody({ type: CreateUtilisateurDto })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (email déjà utilisé, champs manquants)',
  })
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Synchroniser l'utilisateur connecté depuis Zitadel",
    description:
      "Provisioning JIT : crée l'utilisateur en base au premier login " +
      '(sub + email lus dans le token), le rattache par email si un compte ' +
      'local existe déjà, sinon ne fait rien. Idempotent.',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur synchronisé (créé, rattaché ou déjà présent)',
  })
  @ApiResponse({
    status: 401,
    description: 'Token Zitadel manquant ou invalide',
  })
  async sync(
    @CurrentUser() user: ZitadelJwtPayload,
    @Headers('authorization') authorization?: string,
  ) {
    // L'access token JWT Zitadel ne contient pas l'email : on le
    // récupère via le userinfo endpoint avec ce même token.
    let email = user.email;
    if (!email && authorization) {
      const token = authorization.replace(/^Bearer\s+/i, '');
      email = (await this.authService.fetchUserinfoEmail(token)) ?? undefined;
    }
    if (!email) {
      throw new UnprocessableEntityException(
        'Email introuvable : ni dans le token, ni via le userinfo Zitadel',
      );
    }
    return this.utilisateurService.syncFromZitadel(user.sub, email);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les utilisateurs',
    description: 'Récupère la liste complète des utilisateurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
  })
  findAll() {
    return this.utilisateurService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur',
    description: "Récupère les détails d'un utilisateur par son ID",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'utilisateur",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur introuvable',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateurService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un utilisateur',
    description: "Met à jour partiellement les informations d'un utilisateur",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'utilisateur",
    example: 1,
  })
  @ApiBody({ type: UpdateUtilisateurDto })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur introuvable',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(id, updateUtilisateurDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description:
      'Supprime un utilisateur et toutes ses données associées (logs, profil santé) en cascade',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'utilisateur",
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur introuvable',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateurService.remove(id);
  }
}
