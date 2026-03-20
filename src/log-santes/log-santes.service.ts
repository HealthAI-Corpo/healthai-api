import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LogSante } from '../database/entities/log-sante.entity';
import { Utilisateur } from '../database/entities/utilisateur.entity';
import { CreateLogSanteDto } from './dto/create-log-sante.dto';
import { UpdateLogSanteDto } from './dto/update-log-sante.dto';

@Injectable()
export class LogSantesService {
  constructor(
    @InjectRepository(LogSante)
    private readonly logSantesRepository: Repository<LogSante>,
    @InjectRepository(Utilisateur)
    private readonly utilisateursRepository: Repository<Utilisateur>,
  ) {}

  async create(createLogSanteDto: CreateLogSanteDto): Promise<LogSante> {
    const utilisateur = await this.utilisateursRepository.findOne({
      where: { idUtilisateur: createLogSanteDto.idUtilisateur },
    });
    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur ${createLogSanteDto.idUtilisateur} not found`,
      );
    }

    const log = this.logSantesRepository.create({
      poidsKg: createLogSanteDto.poidsKg,
      moyenneBpm: createLogSanteDto.moyenneBpm,
      heuresSommeil: createLogSanteDto.heuresSommeil,
      nbPas: createLogSanteDto.nbPas ?? 0,
      frequenceCardiaque: createLogSanteDto.frequenceCardiaque ?? null,
      utilisateur,
    });
    return this.logSantesRepository.save(log);
  }

  findAll(): Promise<LogSante[]> {
    return this.logSantesRepository.find({
      relations: {
        utilisateur: true,
      },
    });
  }

  async findOne(id: number): Promise<LogSante> {
    const log = await this.logSantesRepository.findOne({
      where: { idLogSante: id },
      relations: {
        utilisateur: true,
      },
    });
    if (!log) {
      throw new NotFoundException(`Log sante ${id} not found`);
    }
    return log;
  }

  async update(
    id: number,
    updateLogSanteDto: UpdateLogSanteDto,
  ): Promise<LogSante> {
    const log = await this.findOne(id);

    if (updateLogSanteDto.poidsKg !== undefined) {
      log.poidsKg = updateLogSanteDto.poidsKg;
    }
    if (updateLogSanteDto.moyenneBpm !== undefined) {
      log.moyenneBpm = updateLogSanteDto.moyenneBpm;
    }
    if (updateLogSanteDto.heuresSommeil !== undefined) {
      log.heuresSommeil = updateLogSanteDto.heuresSommeil;
    }
    if (updateLogSanteDto.nbPas !== undefined) {
      log.nbPas = updateLogSanteDto.nbPas;
    }
    if (updateLogSanteDto.frequenceCardiaque !== undefined) {
      log.frequenceCardiaque = updateLogSanteDto.frequenceCardiaque;
    }

    if (updateLogSanteDto.idUtilisateur !== undefined) {
      const utilisateur = await this.utilisateursRepository.findOne({
        where: { idUtilisateur: updateLogSanteDto.idUtilisateur },
      });
      if (!utilisateur) {
        throw new NotFoundException(
          `Utilisateur ${updateLogSanteDto.idUtilisateur} not found`,
        );
      }
      log.utilisateur = utilisateur;
    }

    return this.logSantesRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    const result = await this.logSantesRepository.delete({ idLogSante: id });
    if (!result.affected) {
      throw new NotFoundException(`Log sante ${id} not found`);
    }
  }
}
