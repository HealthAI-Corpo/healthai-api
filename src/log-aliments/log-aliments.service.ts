import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Aliment } from '../database/entities/aliment.entity';
import { LogAliment } from '../database/entities/log-aliment.entity';
import { Utilisateur } from '../database/entities/utilisateur.entity';
import { CreateLogAlimentDto } from './dto/create-log-aliment.dto';
import { UpdateLogAlimentDto } from './dto/update-log-aliment.dto';

@Injectable()
export class LogAlimentsService {
  constructor(
    @InjectRepository(LogAliment)
    private readonly logAlimentsRepository: Repository<LogAliment>,
    @InjectRepository(Aliment)
    private readonly alimentsRepository: Repository<Aliment>,
    @InjectRepository(Utilisateur)
    private readonly utilisateursRepository: Repository<Utilisateur>,
  ) {}

  async create(createLogAlimentDto: CreateLogAlimentDto): Promise<LogAliment> {
    const aliment = await this.alimentsRepository.findOne({
      where: { idAliment: createLogAlimentDto.idAliment },
    });
    if (!aliment) {
      throw new NotFoundException(
        `Aliment ${createLogAlimentDto.idAliment} not found`,
      );
    }

    const utilisateur = await this.utilisateursRepository.findOne({
      where: { idUtilisateur: createLogAlimentDto.idUtilisateur },
    });
    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur ${createLogAlimentDto.idUtilisateur} not found`,
      );
    }

    const log = this.logAlimentsRepository.create({
      repas: createLogAlimentDto.repas,
      quantiteG: createLogAlimentDto.quantiteG,
      aliment,
      utilisateur,
    });
    return this.logAlimentsRepository.save(log);
  }

  findAll(): Promise<LogAliment[]> {
    return this.logAlimentsRepository.find({
      relations: {
        aliment: true,
        utilisateur: true,
      },
    });
  }

  async findOne(id: number): Promise<LogAliment> {
    const log = await this.logAlimentsRepository.findOne({
      where: { idLogAliment: id },
      relations: {
        aliment: true,
        utilisateur: true,
      },
    });
    if (!log) {
      throw new NotFoundException(`Log aliment ${id} not found`);
    }
    return log;
  }

  async update(
    id: number,
    updateLogAlimentDto: UpdateLogAlimentDto,
  ): Promise<LogAliment> {
    const log = await this.findOne(id);

    if (updateLogAlimentDto.repas !== undefined) {
      log.repas = updateLogAlimentDto.repas;
    }
    if (updateLogAlimentDto.quantiteG !== undefined) {
      log.quantiteG = updateLogAlimentDto.quantiteG;
    }

    if (updateLogAlimentDto.idAliment !== undefined) {
      const aliment = await this.alimentsRepository.findOne({
        where: { idAliment: updateLogAlimentDto.idAliment },
      });
      if (!aliment) {
        throw new NotFoundException(
          `Aliment ${updateLogAlimentDto.idAliment} not found`,
        );
      }
      log.aliment = aliment;
    }

    if (updateLogAlimentDto.idUtilisateur !== undefined) {
      const utilisateur = await this.utilisateursRepository.findOne({
        where: { idUtilisateur: updateLogAlimentDto.idUtilisateur },
      });
      if (!utilisateur) {
        throw new NotFoundException(
          `Utilisateur ${updateLogAlimentDto.idUtilisateur} not found`,
        );
      }
      log.utilisateur = utilisateur;
    }

    return this.logAlimentsRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    const result = await this.logAlimentsRepository.delete({
      idLogAliment: id,
    });
    if (!result.affected) {
      throw new NotFoundException(`Log aliment ${id} not found`);
    }
  }
}
