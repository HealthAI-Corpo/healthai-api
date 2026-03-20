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

import { CreateAlimentDto } from './dto/create-aliment.dto';
import { UpdateAlimentDto } from './dto/update-aliment.dto';
import { AlimentsService } from './aliments.service';

@ApiTags('aliments')
@Controller('aliments')
export class AlimentsController {
  constructor(private readonly alimentsService: AlimentsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un aliment' })
  @ApiResponse({ status: 201, description: 'Aliment créé' })
  @ApiResponse({ status: 400, description: 'Payload invalide' })
  create(@Body() createAlimentDto: CreateAlimentDto) {
    return this.alimentsService.create(createAlimentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les aliments' })
  @ApiResponse({ status: 200, description: 'Liste des aliments' })
  findAll() {
    return this.alimentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un aliment par son identifiant' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Aliment trouvé' })
  @ApiResponse({ status: 404, description: 'Aliment non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alimentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un aliment' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Aliment mis à jour' })
  @ApiResponse({ status: 404, description: 'Aliment non trouvé' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlimentDto: UpdateAlimentDto,
  ) {
    return this.alimentsService.update(id, updateAlimentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un aliment' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Aliment supprimé' })
  @ApiResponse({ status: 404, description: 'Aliment non trouvé' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alimentsService.remove(id);
  }
}
