import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

import { buildRabbitMqOptions, getRabbitMqSettings } from './rabbitmq.config';

describe('rabbitmq.config', () => {
  it('returns disabled settings when RABBITMQ_ENABLED is false', () => {
    const getOrThrow = jest.fn();
    const configService = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const values: Record<string, unknown> = {
          RABBITMQ_ENABLED: false,
          RABBITMQ_QUEUE: 'healthai.load-balance',
          RABBITMQ_PREFETCH_COUNT: 10,
        };
        return values[key] ?? defaultValue;
      }),
      getOrThrow,
    } as unknown as ConfigService;

    const settings = getRabbitMqSettings(configService);

    expect(settings).toEqual({
      enabled: false,
      queue: 'healthai.load-balance',
      urls: [],
      prefetchCount: 10,
    });
    expect(getOrThrow).not.toHaveBeenCalled();
  });

  it('builds a valid AMQP URL with encoded credentials and queue settings', () => {
    const user = '5pLuJzaZ2YJFLiL77FAR4/6MqGQAdy6IDFdeTaGvCGA=';
    const pass = '36J8dfycP0tFbPEgYwLZlL8bjUNusGQgGvuHmKDQs+Q=';
    const host = 'mspr-rabbitmq-a630fb-158-220-101-254.traefik.me';

    const configService = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const values: Record<string, unknown> = {
          RABBITMQ_ENABLED: true,
          RABBITMQ_QUEUE: 'healthai.load-balance',
          RABBITMQ_PREFETCH_COUNT: 10,
          RABBITMQ_PORT: 5672,
          RABBITMQ_VHOST: '/',
          RABBITMQ_TLS: false,
        };
        return values[key] ?? defaultValue;
      }),
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          RABBITMQ_HOST: host,
          RABBITMQ_USER: user,
          RABBITMQ_PASS: pass,
        };
        return values[key];
      }),
    } as unknown as ConfigService;

    const settings = getRabbitMqSettings(configService);
    const options = buildRabbitMqOptions(settings);

    expect(settings.enabled).toBe(true);
    expect(settings.urls).toHaveLength(1);
    expect(settings.urls[0]).toBe(
      `amqp://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:5672/`,
    );
    expect(options).toEqual<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: settings.urls,
        queue: 'healthai.load-balance',
        noAck: false,
        prefetchCount: 10,
        queueOptions: { durable: true },
      },
    });
  });
});
