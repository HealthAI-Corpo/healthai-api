import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Utilisateur } from '../database/entities/utilisateur.entity';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateursRepository: Repository<Utilisateur>,
  ) {}

  create(createUtilisateurDto: CreateUtilisateurDto): Promise<Utilisateur> {
    const utilisateur =
      this.utilisateursRepository.create(createUtilisateurDto);
    return this.utilisateursRepository.save(utilisateur);
  }

  findAll(): Promise<Utilisateur[]> {
    return this.utilisateursRepository.find();
  }

  async findOne(id: number): Promise<Utilisateur> {
    const utilisateur = await this.utilisateursRepository.findOne({
      where: { idUtilisateur: id },
    });
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur ${id} not found`);
    }
    return utilisateur;
  }

  async update(
    id: number,
    updateUtilisateurDto: UpdateUtilisateurDto,
  ): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);
    Object.assign(utilisateur, updateUtilisateurDto);
    return this.utilisateursRepository.save(utilisateur);
  }

  async remove(id: number): Promise<void> {
    const result = await this.utilisateursRepository.delete({
      idUtilisateur: id,
    });
    if (!result.affected) {
      throw new NotFoundException(`Utilisateur ${id} not found`);
    }
  }
}
