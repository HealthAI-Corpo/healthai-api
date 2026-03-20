import { Test, TestingModule } from '@nestjs/testing';
import { EtlController } from './etl.controller';
import { EtlService } from './etl.service';

describe('EtlController', () => {
  let controller: EtlController;
  let etlService: {
    getCurrentCronExpression: jest.Mock;
    updateCronExpression: jest.Mock;
  };

  beforeEach(async () => {
    etlService = {
      getCurrentCronExpression: jest.fn().mockReturnValue('0 0 * * *'),
      updateCronExpression: jest
        .fn()
        .mockImplementation((value: string) => value),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtlController],
      providers: [
        {
          provide: EtlService,
          useValue: etlService,
        },
      ],
    }).compile();

    controller = module.get<EtlController>(EtlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return current schedule', () => {
    expect(controller.getSchedule()).toEqual({ cronExpression: '0 0 * * *' });
    expect(etlService.getCurrentCronExpression).toHaveBeenCalledTimes(1);
  });

  it('should update schedule', () => {
    const payload = { cronExpression: '*/5 * * * *' };
    expect(controller.updateSchedule(payload)).toEqual(payload);
    expect(etlService.updateCronExpression).toHaveBeenCalledWith(
      payload.cronExpression,
    );
  });
});
