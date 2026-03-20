import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Aliment } from '../database/entities/aliment.entity';
import { CreateAlimentDto } from './dto/create-aliment.dto';
import { UpdateAlimentDto } from './dto/update-aliment.dto';

@Injectable()
export class AlimentsService {
  constructor(
    @InjectRepository(Aliment)
    private readonly alimentsRepository: Repository<Aliment>,
  ) {}

  create(createAlimentDto: CreateAlimentDto): Promise<Aliment> {
    const aliment = this.alimentsRepository.create(createAlimentDto);
    return this.alimentsRepository.save(aliment);
  }

  findAll(): Promise<Aliment[]> {
    return this.alimentsRepository.find();
  }

  async findOne(id: number): Promise<Aliment> {
    const aliment = await this.alimentsRepository.findOne({
      where: { idAliment: id },
    });
    if (!aliment) {
      throw new NotFoundException(`Aliment ${id} not found`);
    }
    return aliment;
  }

  async update(
    id: number,
    updateAlimentDto: UpdateAlimentDto,
  ): Promise<Aliment> {
    const aliment = await this.findOne(id);
    Object.assign(aliment, updateAlimentDto);
    return this.alimentsRepository.save(aliment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.alimentsRepository.delete({ idAliment: id });
    if (!result.affected) {
      throw new NotFoundException(`Aliment ${id} not found`);
    }
  }
}
