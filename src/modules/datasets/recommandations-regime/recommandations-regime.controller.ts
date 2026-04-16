import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RecommandationsRegimeService } from './recommandations-regime.service';
import { CreateRecommandationsRegimeDto } from './dto/create-recommandations-regime.dto';
import { UpdateRecommandationsRegimeDto } from './dto/update-recommandations-regime.dto';

@ApiTags('datasets-recommandations')
@ApiBearerAuth('JWT-auth')
@Controller('datasets/recommandations-regime')
export class RecommandationsRegimeController {
  constructor(
    private readonly recommandationsRegimeService: RecommandationsRegimeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une entrée dataset recommandations',
    description:
      "Ajoute des données de recommandations alimentaires pré-nettoyées pour IA (CRUD simple, pas d'ETL)",
  })
  @ApiBody({ type: CreateRecommandationsRegimeDto })
  @ApiResponse({
    status: 201,
    description: 'Entrée créée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(
    @Body() createRecommandationsRegimeDto: CreateRecommandationsRegimeDto,
  ) {
    return this.recommandationsRegimeService.create(
      createRecommandationsRegimeDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister dataset recommandations',
    description: 'Récupère les données du dataset recommandations régimes',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des entrées dataset',
  })
  findAll() {
    return this.recommandationsRegimeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une entrée dataset',
    description: "Détails d'une recommandation alimentaire du dataset",
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: "ID de l'entrée",
    example: 'rec-001',
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
    return this.recommandationsRegimeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier une entrée dataset',
    description: 'Met à jour une recommandation du dataset',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: "ID de l'entrée",
    example: 'rec-001',
  })
  @ApiBody({ type: UpdateRecommandationsRegimeDto })
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
    @Body() updateRecommandationsRegimeDto: UpdateRecommandationsRegimeDto,
  ) {
    return this.recommandationsRegimeService.update(
      id,
      updateRecommandationsRegimeDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer une entrée dataset',
    description: 'Supprime une recommandation du dataset',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: "ID de l'entrée",
    example: 'rec-001',
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
    return this.recommandationsRegimeService.remove(id);
  }
}
