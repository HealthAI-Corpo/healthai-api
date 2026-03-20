import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';

import { EtlService } from './etl.service';

describe('EtlService', () => {
  let service: EtlService;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtlService, SchedulerRegistry],
    }).compile();

    service = module.get<EtlService>(EtlService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with default midnight cron', () => {
    expect(service.getCurrentCronExpression()).toBe('0 0 * * *');
  });

  it('should update cron expression', () => {
    const cronExpression = '*/10 * * * *';
    expect(service.updateCronExpression(cronExpression)).toBe(cronExpression);
    expect(service.getCurrentCronExpression()).toBe(cronExpression);
  });

  it('should throw on invalid cron expression', () => {
    expect(() => service.updateCronExpression('not-a-cron')).toThrow(
      'Unknown alias: not',
    );
  });

  afterEach(() => {
    const job = schedulerRegistry.getCronJobs().get('etl-daily-job');
    if (job) {
      void job.stop();
      schedulerRegistry.deleteCronJob('etl-daily-job');
    }
  });
});
