import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Aliment } from '../database/entities/aliment.entity';
import { AlimentsController } from './aliments.controller';
import { AlimentsService } from './aliments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aliment])],
  controllers: [AlimentsController],
  providers: [AlimentsService],
})
export class AlimentsModule {}
