import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateLogSanteDto } from './dto/create-log-sante.dto';
import { UpdateLogSanteDto } from './dto/update-log-sante.dto';
import { LogSantesService } from './log-santes.service';

@ApiTags('log-santes')
@Controller('log-santes')
export class LogSantesController {
  constructor(private readonly logSantesService: LogSantesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une entrée de journal santé' })
  @ApiResponse({ status: 201, description: 'Entrée créée' })
  @ApiResponse({ status: 400, description: 'Payload invalide' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  create(@Body() createLogSanteDto: CreateLogSanteDto) {
    return this.logSantesService.create(createLogSanteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les entrées de journal santé' })
  @ApiResponse({ status: 200, description: 'Liste des entrées' })
  findAll() {
    return this.logSantesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une entrée de journal santé' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée trouvée' })
  @ApiResponse({ status: 404, description: 'Entrée non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logSantesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une entrée de journal santé' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée mise à jour' })
  @ApiResponse({ status: 404, description: 'Entrée ou utilisateur non trouvé' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLogSanteDto: UpdateLogSanteDto,
  ) {
    return this.logSantesService.update(id, updateLogSanteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une entrée de journal santé' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée supprimée' })
  @ApiResponse({ status: 404, description: 'Entrée non trouvée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logSantesService.remove(id);
  }
}
