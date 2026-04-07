import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async create(
    createUtilisateurDto: CreateUtilisateurDto,
  ): Promise<Utilisateur> {
    const utilisateur = this.utilisateurRepository.create(createUtilisateurDto);
    return this.utilisateurRepository.save(utilisateur);
  }

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateurRepository.find();
  }

  async findOne(id: number): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { idUtilisateur: id },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    return utilisateur;
  }

  async update(
    id: number,
    updateUtilisateurDto: UpdateUtilisateurDto,
  ): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);
    Object.assign(utilisateur, updateUtilisateurDto);
    return this.utilisateurRepository.save(utilisateur);
  }

  async remove(id: number): Promise<void> {
    const utilisateur = await this.findOne(id);
    await this.utilisateurRepository.remove(utilisateur);
  }
}
