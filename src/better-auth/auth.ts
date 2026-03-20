import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Better Auth');
}

const trustedOrigins = (process.env.FRONTEND_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

export const auth = betterAuth({
  appName: 'MSPRHealthAI',
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://api.localhost',
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Pool({
    connectionString: databaseUrl,
  }),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
});
