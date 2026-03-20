import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { EtlController } from './etl.controller';
import { EtlService } from './etl.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [EtlController],
  providers: [EtlService],
})
export class EtlModule {}
