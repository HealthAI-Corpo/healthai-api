import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlimentDto } from './dto/create-aliment.dto';
import { UpdateAlimentDto } from './dto/update-aliment.dto';
import { Aliment } from './entities/aliment.entity';

@Injectable()
export class AlimentService {
  constructor(
    @InjectRepository(Aliment)
    private readonly alimentRepository: Repository<Aliment>,
  ) {}

  async create(createAlimentDto: CreateAlimentDto): Promise<Aliment> {
    const aliment = this.alimentRepository.create(createAlimentDto);
    return this.alimentRepository.save(aliment);
  }

  async findAll(): Promise<Aliment[]> {
    return this.alimentRepository.find();
  }

  async findOne(id: number): Promise<Aliment> {
    const aliment = await this.alimentRepository.findOne({
      where: { idAliment: id },
    });

    if (!aliment) {
      throw new NotFoundException(`Aliment avec l'ID ${id} introuvable`);
    }

    return aliment;
  }

  async update(
    id: number,
    updateAlimentDto: UpdateAlimentDto,
  ): Promise<Aliment> {
    const aliment = await this.findOne(id);
    Object.assign(aliment, updateAlimentDto);
    return this.alimentRepository.save(aliment);
  }

  async remove(id: number): Promise<void> {
    const aliment = await this.findOne(id);
    await this.alimentRepository.remove(aliment);
  }
}
