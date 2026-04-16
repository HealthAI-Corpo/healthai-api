import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtlLogService } from './etl-log.service';
import { EtlLogController } from './etl-log.controller';
import { EtlLog } from './entities/etl-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EtlLog])],
  controllers: [EtlLogController],
  providers: [EtlLogService],
  exports: [EtlLogService],
})
export class EtlLogModule {}
