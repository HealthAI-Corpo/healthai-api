import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogSanteDto } from './dto/create-log-sante.dto';
import { UpdateLogSanteDto } from './dto/update-log-sante.dto';
import { LogSante } from './entities/log-sante.entity';

@Injectable()
export class LogSanteService {
  constructor(
    @InjectRepository(LogSante)
    private readonly logSanteRepository: Repository<LogSante>,
  ) {}

  async create(createLogSanteDto: CreateLogSanteDto): Promise<LogSante> {
    const logSante = this.logSanteRepository.create(createLogSanteDto);
    return this.logSanteRepository.save(logSante);
  }

  async findAll(): Promise<LogSante[]> {
    return this.logSanteRepository.find();
  }

  async findOne(id: number): Promise<LogSante> {
    const logSante = await this.logSanteRepository.findOne({
      where: { idLogSante: id },
    });

    if (!logSante) {
      throw new NotFoundException(`Log santé avec l'ID ${id} introuvable`);
    }

    return logSante;
  }

  async update(
    id: number,
    updateLogSanteDto: UpdateLogSanteDto,
  ): Promise<LogSante> {
    const logSante = await this.findOne(id);
    Object.assign(logSante, updateLogSanteDto);
    return this.logSanteRepository.save(logSante);
  }

  async remove(id: number): Promise<void> {
    const logSante = await this.findOne(id);
    await this.logSanteRepository.remove(logSante);
  }
}
