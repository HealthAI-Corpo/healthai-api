import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('3600s'),
  JWT_ISSUER: Joi.string().min(3).required(),
  JWT_AUDIENCE: Joi.string().min(3).required(),
  API_KEY: Joi.string().min(32).required(),
  FRONTEND_ORIGIN: Joi.string().min(3).required(),
  FRONTEND_CLIENT_ID: Joi.string().min(8).required(),
});
