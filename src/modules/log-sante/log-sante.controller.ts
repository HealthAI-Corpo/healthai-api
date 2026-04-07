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
import { LogSanteService } from './log-sante.service';
import { CreateLogSanteDto } from './dto/create-log-sante.dto';
import { UpdateLogSanteDto } from './dto/update-log-sante.dto';

@ApiTags('log-santes')
@ApiBearerAuth('JWT-auth')
@Controller('logs-sante')
export class LogSanteController {
  constructor(private readonly logSanteService: LogSanteService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un log santé',
    description:
      'Enregistre des métriques de santé quotidiennes (poids, IMC, BPM, pas, sommeil, hydratation)',
  })
  @ApiBody({ type: CreateLogSanteDto })
  @ApiResponse({
    status: 201,
    description: 'Log santé créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createLogSanteDto: CreateLogSanteDto) {
    return this.logSanteService.create(createLogSanteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les logs santé',
    description: 'Récupère l\'historique complet des métriques de santé',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des logs santé',
  })
  findAll() {
    return this.logSanteService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un log santé',
    description: 'Détails des métriques de santé d\'une journée',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du log',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Log trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Log introuvable',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logSanteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un log santé',
    description: 'Met à jour les métriques de santé',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du log',
    example: 1,
  })
  @ApiBody({ type: UpdateLogSanteDto })
  @ApiResponse({
    status: 200,
    description: 'Log mis à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Log introuvable',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLogSanteDto: UpdateLogSanteDto,
  ) {
    return this.logSanteService.update(id, updateLogSanteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un log santé',
    description: 'Supprime une entrée de métriques de santé',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du log',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Log supprimé',
  })
  @ApiResponse({
    status: 404,
    description: 'Log introuvable',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logSanteService.remove(id);
  }
}
