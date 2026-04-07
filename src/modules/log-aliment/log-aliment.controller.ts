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
import { LogAlimentService } from './log-aliment.service';
import { CreateLogAlimentDto } from './dto/create-log-aliment.dto';
import { UpdateLogAlimentDto } from './dto/update-log-aliment.dto';

@ApiTags('log-aliments')
@ApiBearerAuth('JWT-auth')
@Controller('logs-aliment')
export class LogAlimentController {
  constructor(private readonly logAlimentService: LogAlimentService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un log alimentaire',
    description:
      'Enregistre une consommation alimentaire pour un utilisateur (repas, quantité, date)',
  })
  @ApiBody({ type: CreateLogAlimentDto })
  @ApiResponse({
    status: 201,
    description: 'Log alimentaire créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides (utilisateur ou aliment inexistant)',
  })
  create(@Body() createLogAlimentDto: CreateLogAlimentDto) {
    return this.logAlimentService.create(createLogAlimentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les logs alimentaires',
    description: 'Récupère l\'historique complet des consommations alimentaires',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des logs alimentaires',
  })
  findAll() {
    return this.logAlimentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un log alimentaire',
    description: 'Détails d\'une consommation alimentaire',
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
    return this.logAlimentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un log alimentaire',
    description: 'Met à jour une entrée du journal alimentaire',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID du log',
    example: 1,
  })
  @ApiBody({ type: UpdateLogAlimentDto })
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
    @Body() updateLogAlimentDto: UpdateLogAlimentDto,
  ) {
    return this.logAlimentService.update(id, updateLogAlimentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un log alimentaire',
    description: 'Supprime une entrée du journal alimentaire',
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
    return this.logAlimentService.remove(id);
  }
}
