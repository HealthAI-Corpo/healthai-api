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
import { LogSeanceService } from './log-seance.service';
import { CreateLogSeanceDto } from './dto/create-log-seance.dto';
import { UpdateLogSeanceDto } from './dto/update-log-seance.dto';

@ApiTags('log-seances')
@ApiBearerAuth('JWT-auth')
@Controller('logs-seance')
export class LogSeanceController {
  constructor(private readonly logSeanceService: LogSeanceService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un log de séance',
    description:
      'Enregistre une séance d\'entraînement pour un utilisateur (exercice, durée, calories, BPM)',
  })
  @ApiBody({ type: CreateLogSeanceDto })
  @ApiResponse({
    status: 201,
    description: 'Log de séance créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (utilisateur ou exercice inexistant)',
  })
  create(@Body() createLogSeanceDto: CreateLogSeanceDto) {
    return this.logSeanceService.create(createLogSeanceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les logs de séance',
    description: 'Récupère l\'historique complet des séances d\'entraînement',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des logs de séance',
  })
  findAll() {
    return this.logSeanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un log de séance',
    description: 'Détails d\'une séance d\'entraînement',
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
    return this.logSeanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un log de séance',
    description: 'Met à jour une entrée du journal d\'entraînement',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du log',
    example: 1,
  })
  @ApiBody({ type: UpdateLogSeanceDto })
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
    @Body() updateLogSeanceDto: UpdateLogSeanceDto,
  ) {
    return this.logSeanceService.update(id, updateLogSeanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un log de séance',
    description: 'Supprime une entrée du journal d\'entraînement',
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
    return this.logSeanceService.remove(id);
  }
}
