import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEtlLogDto } from './dto/create-etl-log.dto';
import { UpdateEtlLogDto } from './dto/update-etl-log.dto';
import { EtlLog } from './entities/etl-log.entity';

@Injectable()
export class EtlLogService {
  constructor(
    @InjectRepository(EtlLog)
    private readonly etlLogRepository: Repository<EtlLog>,
  ) {}

  async create(createEtlLogDto: CreateEtlLogDto): Promise<EtlLog> {
    const etlLog = this.etlLogRepository.create(createEtlLogDto);
    return this.etlLogRepository.save(etlLog);
  }

  async findAll(): Promise<EtlLog[]> {
    return this.etlLogRepository.find();
  }

  async findOne(id: number): Promise<EtlLog> {
    const etlLog = await this.etlLogRepository.findOne({
      where: { idEtlLog: id },
    });

    if (!etlLog) {
      throw new NotFoundException(`Log ETL avec l'ID ${id} introuvable`);
    }

    return etlLog;
  }

  async update(id: number, updateEtlLogDto: UpdateEtlLogDto): Promise<EtlLog> {
    const etlLog = await this.findOne(id);
    Object.assign(etlLog, updateEtlLogDto);
    return this.etlLogRepository.save(etlLog);
  }

  async remove(id: number): Promise<void> {
    const etlLog = await this.findOne(id);
    await this.etlLogRepository.remove(etlLog);
  }
}
