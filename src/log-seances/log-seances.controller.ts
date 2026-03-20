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

import { CreateLogSeanceDto } from './dto/create-log-seance.dto';
import { UpdateLogSeanceDto } from './dto/update-log-seance.dto';
import { LogSeancesService } from './log-seances.service';

@ApiTags('log-seances')
@Controller('log-seances')
export class LogSeancesController {
  constructor(private readonly logSeancesService: LogSeancesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une entrée de journal de séance' })
  @ApiResponse({ status: 201, description: 'Entrée créée' })
  @ApiResponse({ status: 400, description: 'Payload invalide' })
  @ApiResponse({
    status: 404,
    description: 'Exercice ou utilisateur introuvable',
  })
  create(@Body() createLogSeanceDto: CreateLogSeanceDto) {
    return this.logSeancesService.create(createLogSeanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les entrées de journal de séance' })
  @ApiResponse({ status: 200, description: 'Liste des entrées' })
  findAll() {
    return this.logSeancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une entrée de journal de séance' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée trouvée' })
  @ApiResponse({ status: 404, description: 'Entrée non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logSeancesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une entrée de journal de séance' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée mise à jour' })
  @ApiResponse({ status: 404, description: 'Entrée ou référence non trouvée' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLogSeanceDto: UpdateLogSeanceDto,
  ) {
    return this.logSeancesService.update(id, updateLogSeanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une entrée de journal de séance' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée supprimée' })
  @ApiResponse({ status: 404, description: 'Entrée non trouvée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logSeancesService.remove(id);
  }
}
