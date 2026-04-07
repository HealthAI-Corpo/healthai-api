import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciceDto } from './dto/create-exercice.dto';
import { UpdateExerciceDto } from './dto/update-exercice.dto';
import { Exercice } from './entities/exercice.entity';

@Injectable()
export class ExerciceService {
  constructor(
    @InjectRepository(Exercice)
    private readonly exerciceRepository: Repository<Exercice>,
  ) {}

  async create(createExerciceDto: CreateExerciceDto): Promise<Exercice> {
    const exercice = this.exerciceRepository.create(createExerciceDto);
    return this.exerciceRepository.save(exercice);
  }

  async findAll(): Promise<Exercice[]> {
    return this.exerciceRepository.find();
  }

  async findOne(id: number): Promise<Exercice> {
    const exercice = await this.exerciceRepository.findOne({
      where: { idExercice: id },
    });

    if (!exercice) {
      throw new NotFoundException(`Exercice avec l'ID ${id} introuvable`);
    }

    return exercice;
  }

  async update(
    id: number,
    updateExerciceDto: UpdateExerciceDto,
  ): Promise<Exercice> {
    const exercice = await this.findOne(id);
    Object.assign(exercice, updateExerciceDto);
    return this.exerciceRepository.save(exercice);
  }

  async remove(id: number): Promise<void> {
    const exercice = await this.findOne(id);
    await this.exerciceRepository.remove(exercice);
  }
}
