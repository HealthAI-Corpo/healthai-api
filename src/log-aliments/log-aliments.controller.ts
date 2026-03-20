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

import { CreateLogAlimentDto } from './dto/create-log-aliment.dto';
import { UpdateLogAlimentDto } from './dto/update-log-aliment.dto';
import { LogAlimentsService } from './log-aliments.service';

@ApiTags('log-aliments')
@Controller('log-aliments')
export class LogAlimentsController {
  constructor(private readonly logAlimentsService: LogAlimentsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une entrée de journal alimentaire' })
  @ApiResponse({ status: 201, description: 'Entrée créée' })
  @ApiResponse({ status: 400, description: 'Payload invalide' })
  @ApiResponse({
    status: 404,
    description: 'Aliment ou utilisateur introuvable',
  })
  create(@Body() createLogAlimentDto: CreateLogAlimentDto) {
    return this.logAlimentsService.create(createLogAlimentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les entrées de journal alimentaire' })
  @ApiResponse({ status: 200, description: 'Liste des entrées' })
  findAll() {
    return this.logAlimentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une entrée de journal alimentaire' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée trouvée' })
  @ApiResponse({ status: 404, description: 'Entrée non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logAlimentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une entrée de journal alimentaire' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée mise à jour' })
  @ApiResponse({ status: 404, description: 'Entrée ou référence non trouvée' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLogAlimentDto: UpdateLogAlimentDto,
  ) {
    return this.logAlimentsService.update(id, updateLogAlimentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une entrée de journal alimentaire' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Entrée supprimée' })
  @ApiResponse({ status: 404, description: 'Entrée non trouvée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logAlimentsService.remove(id);
  }
}
