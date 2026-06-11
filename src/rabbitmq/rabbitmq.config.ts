import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export interface RabbitMqSettings {
  enabled: boolean;
  queue: string;
  urls: string[];
  prefetchCount: number;
}

function parseBoolean(value: string | boolean | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }

  return false;
}

export function getRabbitMqSettings(
  configService: ConfigService,
): RabbitMqSettings {
  const enabled = parseBoolean(configService.get('RABBITMQ_ENABLED', false));
  const queue = configService.get<string>(
    'RABBITMQ_QUEUE',
    'healthai.load-balance',
  );
  const prefetchCount = configService.get<number>(
    'RABBITMQ_PREFETCH_COUNT',
    10,
  );

  if (!enabled) {
    return {
      enabled: false,
      queue,
      urls: [],
      prefetchCount,
    };
  }

  const host = configService.getOrThrow<string>('RABBITMQ_HOST');
  const port = configService.get<number>('RABBITMQ_PORT', 5672);
  const username = configService.getOrThrow<string>('RABBITMQ_USER');
  const password = configService.getOrThrow<string>('RABBITMQ_PASS');
  const vhost = configService.get<string>('RABBITMQ_VHOST', '/');
  const useTls = parseBoolean(configService.get('RABBITMQ_TLS', false));
  const protocol = useTls ? 'amqps' : 'amqp';

  const encodedUser = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);
  const normalizedVhost =
    vhost === '/' ? '/' : `/${encodeURIComponent(vhost.replace(/^\//, ''))}`;

  const url = `${protocol}://${encodedUser}:${encodedPassword}@${host}:${port}${normalizedVhost}`;

  return {
    enabled: true,
    queue,
    urls: [url],
    prefetchCount,
  };
}

export function buildRabbitMqOptions(settings: RabbitMqSettings): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: settings.urls,
      queue: settings.queue,
      noAck: false,
      prefetchCount: settings.prefetchCount,
      queueOptions: {
        durable: true,
      },
    },
  };
}
