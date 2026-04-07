import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogSanteService } from './log-sante.service';
import { LogSanteController } from './log-sante.controller';
import { LogSante } from './entities/log-sante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogSante])],
  controllers: [LogSanteController],
  providers: [LogSanteService],
  exports: [LogSanteService],
})
export class LogSanteModule {}
