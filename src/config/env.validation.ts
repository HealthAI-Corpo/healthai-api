import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  // ZITADEL — auth provider
  ZITADEL_ISSUER: Joi.string().uri().required(),
  ZITADEL_JWKS_URI: Joi.string().uri().optional(),
  // Sécurité API
  API_KEY: Joi.string().min(32).required(),
  FRONTEND_ORIGIN: Joi.string().min(3).required(),
  FRONTEND_CLIENT_ID: Joi.string().min(8).required(),
}).unknown(true);
