import { Body, Controller, Get, Patch } from '@nestjs/common';

import { UpdateEtlScheduleDto } from './dto/update-etl-schedule.dto';
import { EtlService } from './etl.service';

@Controller('etl')
export class EtlController {
  constructor(private readonly etlService: EtlService) {}

  @Get('schedule')
  getSchedule() {
    return { cronExpression: this.etlService.getCurrentCronExpression() };
  }

  @Patch('schedule')
  updateSchedule(@Body() body: UpdateEtlScheduleDto) {
    return {
      cronExpression: this.etlService.updateCronExpression(body.cronExpression),
    };
  }
}
