import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogSeanceService } from './log-seance.service';
import { LogSeanceController } from './log-seance.controller';
import { LogSeance } from './entities/log-seance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogSeance])],
  controllers: [LogSeanceController],
  providers: [LogSeanceService],
  exports: [LogSeanceService],
})
export class LogSeanceModule {}
