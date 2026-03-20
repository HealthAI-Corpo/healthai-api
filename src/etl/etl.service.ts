import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, validateCronExpression } from 'cron';

@Injectable()
export class EtlService implements OnModuleInit {
  private static readonly ETL_CRON_JOB_NAME = 'etl-daily-job';
  private static readonly DEFAULT_CRON_EXPRESSION = '0 0 * * *';

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  onModuleInit(): void {
    const cronJobs = this.schedulerRegistry.getCronJobs();
    if (cronJobs.has(EtlService.ETL_CRON_JOB_NAME)) {
      void this.schedulerRegistry
        .getCronJob(EtlService.ETL_CRON_JOB_NAME)
        .stop();
      this.schedulerRegistry.deleteCronJob(EtlService.ETL_CRON_JOB_NAME);
    }

    this.createAndStartCronJob(EtlService.DEFAULT_CRON_EXPRESSION);
  }

  getCurrentCronExpression(): string {
    const cronTimeSource = this.schedulerRegistry.getCronJob(
      EtlService.ETL_CRON_JOB_NAME,
    ).cronTime.source;

    return typeof cronTimeSource === 'string'
      ? cronTimeSource
      : cronTimeSource.toString();
  }

  updateCronExpression(cronExpression: string): string {
    const validationResult = validateCronExpression(cronExpression);
    if (!validationResult.valid) {
      throw new BadRequestException(
        validationResult.error?.message ?? 'Invalid cron expression',
      );
    }

    const existingJob = this.schedulerRegistry.getCronJob(
      EtlService.ETL_CRON_JOB_NAME,
    );
    void existingJob.stop();
    this.schedulerRegistry.deleteCronJob(EtlService.ETL_CRON_JOB_NAME);

    this.createAndStartCronJob(cronExpression);
    return cronExpression;
  }

  private createAndStartCronJob(cronExpression: string): void {
    const cronJob = new CronJob(cronExpression, () => {
      this.runEtlTask();
    });

    this.schedulerRegistry.addCronJob(EtlService.ETL_CRON_JOB_NAME, cronJob);
    cronJob.start();
  }

  private runEtlTask(): void {
    // Placeholder ETL execution hook; actual ETL process wiring comes next.
  }
}
