import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogSeanceDto } from './dto/create-log-seance.dto';
import { UpdateLogSeanceDto } from './dto/update-log-seance.dto';
import { LogSeance } from './entities/log-seance.entity';

@Injectable()
export class LogSeanceService {
  constructor(
    @InjectRepository(LogSeance)
    private readonly logSeanceRepository: Repository<LogSeance>,
  ) {}

  async create(createLogSeanceDto: CreateLogSeanceDto): Promise<LogSeance> {
    const logSeance = this.logSeanceRepository.create(createLogSeanceDto);
    return this.logSeanceRepository.save(logSeance);
  }

  async findAll(): Promise<LogSeance[]> {
    return this.logSeanceRepository.find();
  }

  async findOne(id: number): Promise<LogSeance> {
    const logSeance = await this.logSeanceRepository.findOne({
      where: { idSeanceLog: id },
    });

    if (!logSeance) {
      throw new NotFoundException(`Log séance avec l'ID ${id} introuvable`);
    }

    return logSeance;
  }

  async update(
    id: number,
    updateLogSeanceDto: UpdateLogSeanceDto,
  ): Promise<LogSeance> {
    const logSeance = await this.findOne(id);
    Object.assign(logSeance, updateLogSeanceDto);
    return this.logSeanceRepository.save(logSeance);
  }

  async remove(id: number): Promise<void> {
    const logSeance = await this.findOne(id);
    await this.logSeanceRepository.remove(logSeance);
  }
}
