import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  FRONTEND_ORIGIN: z.string(),
  DISABLE_HELMET: z.coerce.boolean().default(false),

  MONGODB_URI: z.string(),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

const ENV = envSchema.parse(process.env);

export enum NODE_ENVS {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export default ENV;
