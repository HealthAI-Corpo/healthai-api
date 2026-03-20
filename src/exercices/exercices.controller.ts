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

import { CreateExerciceDto } from './dto/create-exercice.dto';
import { UpdateExerciceDto } from './dto/update-exercice.dto';
import { ExercicesService } from './exercices.service';

@ApiTags('exercices')
@Controller('exercices')
export class ExercicesController {
  constructor(private readonly exercicesService: ExercicesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un exercice' })
  @ApiResponse({ status: 201, description: 'Exercice créé' })
  @ApiResponse({ status: 400, description: 'Payload invalide' })
  create(@Body() createExerciceDto: CreateExerciceDto) {
    return this.exercicesService.create(createExerciceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les exercices' })
  @ApiResponse({ status: 200, description: 'Liste des exercices' })
  findAll() {
    return this.exercicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un exercice par son identifiant' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Exercice trouvé' })
  @ApiResponse({ status: 404, description: 'Exercice non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exercicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un exercice' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Exercice mis à jour' })
  @ApiResponse({ status: 404, description: 'Exercice non trouvé' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciceDto: UpdateExerciceDto,
  ) {
    return this.exercicesService.update(id, updateExerciceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un exercice' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Exercice supprimé' })
  @ApiResponse({ status: 404, description: 'Exercice non trouvé' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exercicesService.remove(id);
  }
}
