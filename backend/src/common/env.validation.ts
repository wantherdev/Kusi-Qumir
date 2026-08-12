import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  CORS_ORIGINS: Joi.string().required(),
  CONTACT_RECIPIENT_EMAIL: Joi.string().email().optional(),
  PRIVACY_POLICY_VERSION: Joi.string().min(1).required(),
});
