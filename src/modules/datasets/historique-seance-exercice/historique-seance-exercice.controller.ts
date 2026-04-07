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
import { HistoriqueSeanceExerciceService } from './historique-seance-exercice.service';
import { CreateHistoriqueSeanceExerciceDto } from './dto/create-historique-seance-exercice.dto';
import { UpdateHistoriqueSeanceExerciceDto } from './dto/update-historique-seance-exercice.dto';

@ApiTags('datasets-exercices')
@ApiBearerAuth('JWT-auth')
@Controller('datasets/historique-seance-exercice')
export class HistoriqueSeanceExerciceController {
  constructor(
    private readonly historiqueSeanceExerciceService: HistoriqueSeanceExerciceService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une entrée dataset exercices',
    description:
      "Ajoute des données d'historique d'exercices pré-nettoyées pour IA (CRUD simple, pas d'ETL)",
  })
  @ApiBody({ type: CreateHistoriqueSeanceExerciceDto })
  @ApiResponse({
    status: 201,
    description: 'Entrée créée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(
    @Body()
    createHistoriqueSeanceExerciceDto: CreateHistoriqueSeanceExerciceDto,
  ) {
    return this.historiqueSeanceExerciceService.create(
      createHistoriqueSeanceExerciceDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister dataset exercices',
    description: 'Récupère les données du dataset historique exercices',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des entrées dataset',
  })
  findAll() {
    return this.historiqueSeanceExerciceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une entrée dataset',
    description: "Détails d'un historique d'exercice du dataset",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'entrée",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Entrée trouvée',
  })
  @ApiResponse({
    status: 404,
    description: 'Entrée introuvable',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.historiqueSeanceExerciceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier une entrée dataset',
    description: "Met à jour un historique d'exercice du dataset",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'entrée",
    example: 1,
  })
  @ApiBody({ type: UpdateHistoriqueSeanceExerciceDto })
  @ApiResponse({
    status: 200,
    description: 'Entrée mise à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Entrée introuvable',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateHistoriqueSeanceExerciceDto: UpdateHistoriqueSeanceExerciceDto,
  ) {
    return this.historiqueSeanceExerciceService.update(
      id,
      updateHistoriqueSeanceExerciceDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer une entrée dataset',
    description: "Supprime un historique d'exercice du dataset",
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: "ID de l'entrée",
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Entrée supprimée',
  })
  @ApiResponse({
    status: 404,
    description: 'Entrée introuvable',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.historiqueSeanceExerciceService.remove(id);
  }
}
