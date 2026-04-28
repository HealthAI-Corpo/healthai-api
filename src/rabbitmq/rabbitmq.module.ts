import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

import { buildRabbitMqOptions, getRabbitMqSettings } from './rabbitmq.config';
import { RABBITMQ_CLIENT } from './rabbitmq.constants';
import { RabbitMqService } from './rabbitmq.service';

@Global()
@Module({
  providers: [
    {
      provide: RABBITMQ_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ClientProxy | null => {
        const settings = getRabbitMqSettings(configService);
        if (!settings.enabled) {
          return null;
        }

        return ClientProxyFactory.create(buildRabbitMqOptions(settings));
      },
    },
    RabbitMqService,
  ],
  exports: [RABBITMQ_CLIENT, RabbitMqService],
})
export class RabbitMqModule implements OnApplicationShutdown {
  constructor(
    @Inject(RABBITMQ_CLIENT) private readonly rabbitClient: ClientProxy | null,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    if (this.rabbitClient) {
      await this.rabbitClient.close();
    }
  }
}
