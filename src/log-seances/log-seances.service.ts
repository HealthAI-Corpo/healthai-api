import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exercice } from '../database/entities/exercice.entity';
import { LogSeance } from '../database/entities/log-seance.entity';
import { Utilisateur } from '../database/entities/utilisateur.entity';
import { CreateLogSeanceDto } from './dto/create-log-seance.dto';
import { UpdateLogSeanceDto } from './dto/update-log-seance.dto';

@Injectable()
export class LogSeancesService {
  constructor(
    @InjectRepository(LogSeance)
    private readonly logSeancesRepository: Repository<LogSeance>,
    @InjectRepository(Exercice)
    private readonly exercicesRepository: Repository<Exercice>,
    @InjectRepository(Utilisateur)
    private readonly utilisateursRepository: Repository<Utilisateur>,
  ) {}

  async create(createLogSeanceDto: CreateLogSeanceDto): Promise<LogSeance> {
    const exercice = await this.exercicesRepository.findOne({
      where: { idExercice: createLogSeanceDto.idExercice },
    });
    if (!exercice) {
      throw new NotFoundException(
        `Exercice ${createLogSeanceDto.idExercice} not found`,
      );
    }

    const utilisateur = await this.utilisateursRepository.findOne({
      where: { idUtilisateur: createLogSeanceDto.idUtilisateur },
    });
    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur ${createLogSeanceDto.idUtilisateur} not found`,
      );
    }

    const log = this.logSeancesRepository.create({
      dureeExercice: createLogSeanceDto.dureeExercice,
      calorieBrulee: createLogSeanceDto.calorieBrulee,
      exercice,
      utilisateur,
    });
    return this.logSeancesRepository.save(log);
  }

  findAll(): Promise<LogSeance[]> {
    return this.logSeancesRepository.find({
      relations: {
        exercice: true,
        utilisateur: true,
      },
    });
  }

  async findOne(id: number): Promise<LogSeance> {
    const log = await this.logSeancesRepository.findOne({
      where: { idSeanceLog: id },
      relations: {
        exercice: true,
        utilisateur: true,
      },
    });
    if (!log) {
      throw new NotFoundException(`Log seance ${id} not found`);
    }
    return log;
  }

  async update(
    id: number,
    updateLogSeanceDto: UpdateLogSeanceDto,
  ): Promise<LogSeance> {
    const log = await this.findOne(id);

    if (updateLogSeanceDto.dureeExercice !== undefined) {
      log.dureeExercice = updateLogSeanceDto.dureeExercice;
    }
    if (updateLogSeanceDto.calorieBrulee !== undefined) {
      log.calorieBrulee = updateLogSeanceDto.calorieBrulee;
    }

    if (updateLogSeanceDto.idExercice !== undefined) {
      const exercice = await this.exercicesRepository.findOne({
        where: { idExercice: updateLogSeanceDto.idExercice },
      });
      if (!exercice) {
        throw new NotFoundException(
          `Exercice ${updateLogSeanceDto.idExercice} not found`,
        );
      }
      log.exercice = exercice;
    }

    if (updateLogSeanceDto.idUtilisateur !== undefined) {
      const utilisateur = await this.utilisateursRepository.findOne({
        where: { idUtilisateur: updateLogSeanceDto.idUtilisateur },
      });
      if (!utilisateur) {
        throw new NotFoundException(
          `Utilisateur ${updateLogSeanceDto.idUtilisateur} not found`,
        );
      }
      log.utilisateur = utilisateur;
    }

    return this.logSeancesRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    const result = await this.logSeancesRepository.delete({ idSeanceLog: id });
    if (!result.affected) {
      throw new NotFoundException(`Log seance ${id} not found`);
    }
  }
}
