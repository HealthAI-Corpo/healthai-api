import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoriqueSeanceExerciceDto } from './dto/create-historique-seance-exercice.dto';
import { UpdateHistoriqueSeanceExerciceDto } from './dto/update-historique-seance-exercice.dto';
import { HistoriqueSeanceExercice } from './entities/historique-seance-exercice.entity';

@Injectable()
export class HistoriqueSeanceExerciceService {
  constructor(
    @InjectRepository(HistoriqueSeanceExercice)
    private readonly historiqueSeanceExerciceRepository: Repository<HistoriqueSeanceExercice>,
  ) {}

  async create(
    createHistoriqueSeanceExerciceDto: CreateHistoriqueSeanceExerciceDto,
  ): Promise<HistoriqueSeanceExercice> {
    const historique = this.historiqueSeanceExerciceRepository.create(
      createHistoriqueSeanceExerciceDto,
    );
    return this.historiqueSeanceExerciceRepository.save(historique);
  }

  async findAll(): Promise<HistoriqueSeanceExercice[]> {
    return this.historiqueSeanceExerciceRepository.find();
  }

  async findOne(id: number): Promise<HistoriqueSeanceExercice> {
    const historique = await this.historiqueSeanceExerciceRepository.findOne({
      where: { idDatasetHistoriqueSeanceExercice: id },
    });

    if (!historique) {
      throw new NotFoundException(
        `Historique séance exercice avec l'ID ${id} introuvable`,
      );
    }

    return historique;
  }

  async update(
    id: number,
    updateHistoriqueSeanceExerciceDto: UpdateHistoriqueSeanceExerciceDto,
  ): Promise<HistoriqueSeanceExercice> {
    const historique = await this.findOne(id);
    Object.assign(historique, updateHistoriqueSeanceExerciceDto);
    return this.historiqueSeanceExerciceRepository.save(historique);
  }

  async remove(id: number): Promise<void> {
    const historique = await this.findOne(id);
    await this.historiqueSeanceExerciceRepository.remove(historique);
  }
}
