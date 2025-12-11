import 'dotenv/config';
import z from 'zod';

type EnvSchema = {
  PORT: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
  JWT_EXPIRES_IN: string;
  COOKIE_SECURE: boolean;
  MAILER_USER: string;
  MAILER_PASSWORD: string;
};

const envSchema = z.object({
  PORT: z.string().min(1).max(5).default('3000'),
  JWT_SECRET: z.string().min(1).max(50).default('Lc4gIGP3VyL5TM7E'),
  DATABASE_URL: z
    .string()
    .min(1)
    .max(255)
    .default('postgresql://postgres:admin@localhost:5432/BudgetManager'),
  JWT_EXPIRES_IN: z.string().min(1).max(50).default('1h'),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  MAILER_USER: z.string().min(1).max(255).default('user@example.com'),
  MAILER_PASSWORD: z.string().min(1).max(255).default('password'),
});

const { error, data } = envSchema.safeParse(process.env);

if (error) {
  console.error('Invalid environment variables:', error);
  process.exit(1);
}

export default data as EnvSchema;
