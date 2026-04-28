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
  DEV_DEFAULT_USER_EMAIL: Joi.string()
    .email({ tlds: { allow: false } })
    .allow('')
    .optional(),
  DEV_DEFAULT_USER_PASSWORD: Joi.string().min(8).allow('').optional(),
}).unknown(true); // Allow unknown env variables
