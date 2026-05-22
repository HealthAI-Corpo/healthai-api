import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfilSanteDto } from './dto/create-profil-sante.dto';
import { UpdateProfilSanteDto } from './dto/update-profil-sante.dto';
import { ProfilSante } from './entities/profil-sante.entity';

@Injectable()
export class ProfilSanteService {
  constructor(
    @InjectRepository(ProfilSante)
    private readonly profilSanteRepository: Repository<ProfilSante>,
  ) {}

  async create(
    createProfilSanteDto: CreateProfilSanteDto,
  ): Promise<ProfilSante> {
    const profilSante = this.profilSanteRepository.create(createProfilSanteDto);
    return this.profilSanteRepository.save(profilSante);
  }

  async findAll(): Promise<ProfilSante[]> {
    return this.profilSanteRepository.find();
  }

  async findOne(id: number): Promise<ProfilSante> {
    const profilSante = await this.profilSanteRepository.findOne({
      where: { idProfil: id },
    });

    if (!profilSante) {
      throw new NotFoundException(`Profil santé avec l'ID ${id} introuvable`);
    }

    return profilSante;
  }

  async update(
    id: number,
    updateProfilSanteDto: UpdateProfilSanteDto,
  ): Promise<ProfilSante> {
    const profilSante = await this.findOne(id);
    Object.assign(profilSante, updateProfilSanteDto);
    return this.profilSanteRepository.save(profilSante);
  }

  async remove(id: number): Promise<void> {
    const profilSante = await this.findOne(id);
    await this.profilSanteRepository.remove(profilSante);
  }
}
