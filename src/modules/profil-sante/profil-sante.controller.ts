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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProfilSanteService } from './profil-sante.service';
import { CreateProfilSanteDto } from './dto/create-profil-sante.dto';
import { UpdateProfilSanteDto } from './dto/update-profil-sante.dto';

@ApiTags('profil-sante')
@ApiBearerAuth('JWT-auth')
@Controller('profils-sante')
export class ProfilSanteController {
  constructor(private readonly profilSanteService: ProfilSanteService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un profil santé',
    description:
      'Crée un profil santé 1:1 avec un utilisateur (objectifs, restrictions, maladies, allergies)',
  })
  @ApiBody({ type: CreateProfilSanteDto })
  @ApiResponse({
    status: 201,
    description: 'Profil santé créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Utilisateur invalide ou profil déjà existant',
  })
  create(@Body() createProfilSanteDto: CreateProfilSanteDto) {
    return this.profilSanteService.create(createProfilSanteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les profils santé',
    description: 'Récupère tous les profils santé',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils santé',
  })
  findAll() {
    return this.profilSanteService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un profil santé',
    description:
      'Détails du profil santé avec objectifs, restrictions et pathologies',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du profil santé',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Profil santé trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Profil santé introuvable',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profilSanteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un profil santé',
    description: 'Met à jour les informations du profil santé',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du profil santé',
    example: 1,
  })
  @ApiBody({ type: UpdateProfilSanteDto })
  @ApiResponse({
    status: 200,
    description: 'Profil santé mis à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Profil santé introuvable',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfilSanteDto: UpdateProfilSanteDto,
  ) {
    return this.profilSanteService.update(id, updateProfilSanteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un profil santé',
    description:
      'Supprime un profil santé (automatiquement supprimé en cascade si l\'utilisateur est supprimé)',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du profil santé',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Profil santé supprimé',
  })
  @ApiResponse({
    status: 404,
    description: 'Profil santé introuvable',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profilSanteService.remove(id);
  }
}
