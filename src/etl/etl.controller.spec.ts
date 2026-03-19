import { Test, TestingModule } from '@nestjs/testing';
import { EtlController } from './etl.controller';

describe('EtlController', () => {
  let controller: EtlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtlController],
    }).compile();

    controller = module.get<EtlController>(EtlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
