import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlimentService } from './aliment.service';
import { AlimentController } from './aliment.controller';
import { Aliment } from './entities/aliment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aliment])],
  controllers: [AlimentController],
  providers: [AlimentService],
  exports: [AlimentService],
})
export class AlimentModule {}
