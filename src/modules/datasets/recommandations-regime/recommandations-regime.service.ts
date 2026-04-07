import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecommandationsRegimeDto } from './dto/create-recommandations-regime.dto';
import { UpdateRecommandationsRegimeDto } from './dto/update-recommandations-regime.dto';
import { RecommandationsRegime } from './entities/recommandations-regime.entity';

@Injectable()
export class RecommandationsRegimeService {
  constructor(
    @InjectRepository(RecommandationsRegime)
    private readonly recommandationsRegimeRepository: Repository<RecommandationsRegime>,
  ) {}

  async create(
    createRecommandationsRegimeDto: CreateRecommandationsRegimeDto,
  ): Promise<RecommandationsRegime> {
    const recommandation = this.recommandationsRegimeRepository.create(
      createRecommandationsRegimeDto,
    );
    return this.recommandationsRegimeRepository.save(recommandation);
  }

  async findAll(): Promise<RecommandationsRegime[]> {
    return this.recommandationsRegimeRepository.find();
  }

  async findOne(id: string): Promise<RecommandationsRegime> {
    const recommandation = await this.recommandationsRegimeRepository.findOne({
      where: { idDatasetRecommandationsRegime: id },
    });

    if (!recommandation) {
      throw new NotFoundException(
        `Recommandation régime avec l'ID ${id} introuvable`,
      );
    }

    return recommandation;
  }

  async update(
    id: string,
    updateRecommandationsRegimeDto: UpdateRecommandationsRegimeDto,
  ): Promise<RecommandationsRegime> {
    const recommandation = await this.findOne(id);
    Object.assign(recommandation, updateRecommandationsRegimeDto);
    return this.recommandationsRegimeRepository.save(recommandation);
  }

  async remove(id: string): Promise<void> {
    const recommandation = await this.findOne(id);
    await this.recommandationsRegimeRepository.remove(recommandation);
  }
}
