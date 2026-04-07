import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogAlimentDto } from './dto/create-log-aliment.dto';
import { UpdateLogAlimentDto } from './dto/update-log-aliment.dto';
import { LogAliment } from './entities/log-aliment.entity';

@Injectable()
export class LogAlimentService {
  constructor(
    @InjectRepository(LogAliment)
    private readonly logAlimentRepository: Repository<LogAliment>,
  ) {}

  async create(createLogAlimentDto: CreateLogAlimentDto): Promise<LogAliment> {
    const logAliment = this.logAlimentRepository.create(createLogAlimentDto);
    return this.logAlimentRepository.save(logAliment);
  }

  async findAll(): Promise<LogAliment[]> {
    return this.logAlimentRepository.find();
  }

  async findOne(id: number): Promise<LogAliment> {
    const logAliment = await this.logAlimentRepository.findOne({
      where: { idLogAliment: id },
    });

    if (!logAliment) {
      throw new NotFoundException(`Log aliment avec l'ID ${id} introuvable`);
    }

    return logAliment;
  }

  async update(
    id: number,
    updateLogAlimentDto: UpdateLogAlimentDto,
  ): Promise<LogAliment> {
    const logAliment = await this.findOne(id);
    Object.assign(logAliment, updateLogAlimentDto);
    return this.logAlimentRepository.save(logAliment);
  }

  async remove(id: number): Promise<void> {
    const logAliment = await this.findOne(id);
    await this.logAlimentRepository.remove(logAliment);
  }
}
