import { ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

import { RabbitMqService } from './rabbitmq.service';

describe('RabbitMqService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws when trying to emit while RabbitMQ is disabled', async () => {
    const service = new RabbitMqService(null);

    await expect(service.emit('work.created', { id: 1 })).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('uses ClientProxy emit/send when RabbitMQ is enabled', async () => {
    const emitMock = jest.fn().mockReturnValue(of(undefined));
    const sendMock = jest.fn().mockReturnValue(of({ ok: true }));
    const client = {
      emit: emitMock,
      send: sendMock,
    } as unknown as ClientProxy;

    const service = new RabbitMqService(client);

    await service.emit('work.created', { id: 1 });
    const response = await service.send<{ ok: boolean }, { id: number }>(
      'work.process',
      { id: 1 },
    );

    expect(emitMock).toHaveBeenCalledWith('work.created', { id: 1 });
    expect(sendMock).toHaveBeenCalledWith('work.process', { id: 1 });
    expect(response).toEqual({ ok: true });
  });
});
