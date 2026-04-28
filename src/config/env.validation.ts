import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  ZITADEL_ISSUER: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  ZITADEL_AUDIENCE: Joi.string().min(3).required(),
  ZITADEL_JWKS_URI: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional(),
  API_KEY: Joi.string().min(32).required(),
  FRONTEND_ORIGIN: Joi.string().min(3).required(),
  FRONTEND_CLIENT_ID: Joi.string().min(8).required(),
  RATE_LIMIT_TTL_MS: Joi.number().integer().min(1).default(60000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
  DEV_DEFAULT_USER_EMAIL: Joi.string()
    .email({ tlds: { allow: false } })
    .allow('')
    .optional(),
  DEV_DEFAULT_USER_PASSWORD: Joi.string().min(8).allow('').optional(),
  RABBITMQ_ENABLED: Joi.boolean().default(false),
  RABBITMQ_HOST: Joi.string().when('RABBITMQ_ENABLED', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  RABBITMQ_PORT: Joi.number().integer().min(1).max(65535).default(5672),
  RABBITMQ_USER: Joi.string().when('RABBITMQ_ENABLED', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  RABBITMQ_PASS: Joi.string().when('RABBITMQ_ENABLED', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  RABBITMQ_VHOST: Joi.string().default('/'),
  RABBITMQ_TLS: Joi.boolean().default(false),
  RABBITMQ_QUEUE: Joi.string().default('healthai.load-balance'),
  RABBITMQ_PREFETCH_COUNT: Joi.number().integer().min(1).default(10),
}).unknown(true); // Allow unknown env variables
