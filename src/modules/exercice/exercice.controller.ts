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
import { ExerciceService } from './exercice.service';
import { CreateExerciceDto } from './dto/create-exercice.dto';
import { UpdateExerciceDto } from './dto/update-exercice.dto';

@ApiTags('exercices')
@ApiBearerAuth('JWT-auth')
@Controller('exercices')
export class ExerciceController {
  constructor(private readonly exerciceService: ExerciceService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un exercice',
    description:
      'Ajoute un nouvel exercice au catalogue avec type, muscle ciblé, équipement et instructions',
  })
  @ApiBody({ type: CreateExerciceDto })
  @ApiResponse({
    status: 201,
    description: 'Exercice créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createExerciceDto: CreateExerciceDto) {
    return this.exerciceService.create(createExerciceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les exercices',
    description: 'Récupère le catalogue complet des exercices',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des exercices',
  })
  findAll() {
    return this.exerciceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un exercice',
    description: "Détails d'un exercice avec instructions et caractéristiques",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'exercice",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Exercice trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Exercice introuvable',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un exercice',
    description: "Met à jour les informations d'un exercice",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'exercice",
    example: 1,
  })
  @ApiBody({ type: UpdateExerciceDto })
  @ApiResponse({
    status: 200,
    description: 'Exercice mis à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Exercice introuvable',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciceDto: UpdateExerciceDto,
  ) {
    return this.exerciceService.update(id, updateExerciceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un exercice',
    description:
      "ATTENTION: La suppression est bloquée si l'exercice est référencé dans des logs de séance",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'exercice",
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Exercice supprimé',
  })
  @ApiResponse({
    status: 404,
    description: 'Exercice introuvable',
  })
  @ApiResponse({
    status: 409,
    description: 'Exercice référencé, suppression impossible',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciceService.remove(id);
  }
}
