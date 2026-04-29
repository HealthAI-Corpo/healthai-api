import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { RABBITMQ_CLIENT } from './rabbitmq.constants';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject(RABBITMQ_CLIENT) private readonly rabbitClient: ClientProxy | null,
  ) {}

  async emit<TPayload = unknown>(
    pattern: string | Record<string, unknown>,
    payload: TPayload,
  ): Promise<void> {
    if (!this.rabbitClient) {
      throw new ServiceUnavailableException(
        'RabbitMQ is disabled. Enable it with RABBITMQ_ENABLED=true.',
      );
    }

    await firstValueFrom(this.rabbitClient.emit(pattern, payload));
  }

  async send<TResult = unknown, TPayload = unknown>(
    pattern: string | Record<string, unknown>,
    payload: TPayload,
  ): Promise<TResult> {
    if (!this.rabbitClient) {
      throw new ServiceUnavailableException(
        'RabbitMQ is disabled. Enable it with RABBITMQ_ENABLED=true.',
      );
    }

    return firstValueFrom(
      this.rabbitClient.send<TResult, TPayload>(pattern, payload),
    );
  }
}
