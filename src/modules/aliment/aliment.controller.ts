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
import { AlimentService } from './aliment.service';
import { CreateAlimentDto } from './dto/create-aliment.dto';
import { UpdateAlimentDto } from './dto/update-aliment.dto';

@ApiTags('aliments')
@ApiBearerAuth('JWT-auth')
@Controller('aliments')
export class AlimentController {
  constructor(private readonly alimentService: AlimentService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un aliment',
    description:
      'Ajoute un nouvel aliment au catalogue avec ses informations nutritionnelles',
  })
  @ApiBody({ type: CreateAlimentDto })
  @ApiResponse({
    status: 201,
    description: 'Aliment créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createAlimentDto: CreateAlimentDto) {
    return this.alimentService.create(createAlimentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les aliments',
    description: 'Récupère le catalogue complet des aliments',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des aliments avec infos nutritionnelles',
  })
  findAll() {
    return this.alimentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un aliment',
    description: 'Détails d\'un aliment avec ses valeurs nutritionnelles',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID de l\'aliment',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Aliment trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Aliment introuvable',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alimentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un aliment',
    description: 'Met à jour les informations d\'un aliment',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID de l\'aliment',
    example: 1,
  })
  @ApiBody({ type: UpdateAlimentDto })
  @ApiResponse({
    status: 200,
    description: 'Aliment mis à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Aliment introuvable',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlimentDto: UpdateAlimentDto,
  ) {
    return this.alimentService.update(id, updateAlimentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un aliment',
    description:
      'ATTENTION: La suppression est bloquée si l\'aliment est référencé dans des logs alimentaires',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID de l\'aliment',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Aliment supprimé',
  })
  @ApiResponse({
    status: 404,
    description: 'Aliment introuvable',
  })
  @ApiResponse({
    status: 409,
    description: 'Aliment référencé, suppression impossible',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alimentService.remove(id);
  }
}
