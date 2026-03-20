import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exercice } from '../database/entities/exercice.entity';
import { CreateExerciceDto } from './dto/create-exercice.dto';
import { UpdateExerciceDto } from './dto/update-exercice.dto';

@Injectable()
export class ExercicesService {
  constructor(
    @InjectRepository(Exercice)
    private readonly exercicesRepository: Repository<Exercice>,
  ) {}

  create(createExerciceDto: CreateExerciceDto): Promise<Exercice> {
    const exercice = this.exercicesRepository.create(createExerciceDto);
    return this.exercicesRepository.save(exercice);
  }

  findAll(): Promise<Exercice[]> {
    return this.exercicesRepository.find();
  }

  async findOne(id: number): Promise<Exercice> {
    const exercice = await this.exercicesRepository.findOne({
      where: { idExercice: id },
    });
    if (!exercice) {
      throw new NotFoundException(`Exercice ${id} not found`);
    }
    return exercice;
  }

  async update(
    id: number,
    updateExerciceDto: UpdateExerciceDto,
  ): Promise<Exercice> {
    const exercice = await this.findOne(id);
    Object.assign(exercice, updateExerciceDto);
    return this.exercicesRepository.save(exercice);
  }

  async remove(id: number): Promise<void> {
    const result = await this.exercicesRepository.delete({ idExercice: id });
    if (!result.affected) {
      throw new NotFoundException(`Exercice ${id} not found`);
    }
  }
}
