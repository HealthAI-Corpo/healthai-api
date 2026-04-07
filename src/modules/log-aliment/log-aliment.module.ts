import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAlimentService } from './log-aliment.service';
import { LogAlimentController } from './log-aliment.controller';
import { LogAliment } from './entities/log-aliment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogAliment])],
  controllers: [LogAlimentController],
  providers: [LogAlimentService],
  exports: [LogAlimentService],
})
export class LogAlimentModule {}
