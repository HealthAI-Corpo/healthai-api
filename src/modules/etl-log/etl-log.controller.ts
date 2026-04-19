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
import { EtlLogService } from './etl-log.service';
import { CreateEtlLogDto } from './dto/create-etl-log.dto';
import { UpdateEtlLogDto } from './dto/update-etl-log.dto';

@ApiTags('etl-log')
@ApiBearerAuth('JWT-auth')
@Controller('etl-log')
export class EtlLogController {
  constructor(private readonly etlLogService: EtlLogService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un log ETL',
    description: "Enregistre le résultat d'une exécution de pipeline ETL",
  })
  @ApiBody({ type: CreateEtlLogDto })
  @ApiResponse({ status: 201, description: 'Log ETL créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createEtlLogDto: CreateEtlLogDto) {
    return this.etlLogService.create(createEtlLogDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les logs ETL',
    description: 'Récupère tous les logs des pipelines ETL',
  })
  @ApiResponse({ status: 200, description: 'Liste des logs ETL' })
  findAll() {
    return this.etlLogService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un log ETL',
    description: "Détails d'un log ETL par son ID",
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID du log ETL', example: 1 })
  @ApiResponse({ status: 200, description: 'Log ETL trouvé' })
  @ApiResponse({ status: 404, description: 'Log ETL introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.etlLogService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un log ETL',
    description: "Met à jour les informations d'un log ETL",
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID du log ETL', example: 1 })
  @ApiBody({ type: UpdateEtlLogDto })
  @ApiResponse({ status: 200, description: 'Log ETL mis à jour' })
  @ApiResponse({ status: 404, description: 'Log ETL introuvable' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEtlLogDto: UpdateEtlLogDto,
  ) {
    return this.etlLogService.update(id, updateEtlLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un log ETL',
    description: 'Supprime un log ETL par son ID',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID du log ETL', example: 1 })
  @ApiResponse({ status: 204, description: 'Log ETL supprimé' })
  @ApiResponse({ status: 404, description: 'Log ETL introuvable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.etlLogService.remove(id);
  }
}
