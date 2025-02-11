import { z } from "zod";

const envSchema = z.object({
  // Variables d'authentification sociale
  NEXT_PUBLIC_GOOGLE_AUTH: z
    .enum(["true", "false", ""])
    .optional()
    .default("false"),
  NEXT_PUBLIC_GITHUB_AUTH: z
    .enum(["true", "false", ""])
    .optional()
    .default("false"),
  NEXT_PUBLIC_FACEBOOK_AUTH: z
    .enum(["true", "false", ""])
    .optional()
    .default("false"),

  // Identifiants Google
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Identifiants GitHub
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Identifiants Facebook
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),

  // Autres variables d'environnement
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional().or(z.literal("")),

  // Variables Cloudflare - Server Only
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_SECRET_KEY: z.string().optional(),
  CLOUDFLARE_BUCKET: z.string().optional(),
  CLOUDFLARE_REGION: z.string().optional(),

  // Variables Cloudflare - Public
  CLOUDFLARE_URL: z.string().url().optional(),

  // Variables pour l'email
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.number().int().positive().optional(),
  EMAIL_FROM: z.string().email().optional().or(z.literal("")),

  SENDGRID_API_KEY: z.string().optional(),

  // Variables Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_BILLING_URL: z.string().url().optional().or(z.literal("")),

  NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),

  // New variable
  NEXT_PUBLIC_MAX_FILE_SIZE: z
    .string()
    .transform((val) => parseInt(val, 10) * 1024 * 1024)
    .default("5"), // Valeur par défaut de 5MB
});

const processEnv = {
  NEXT_PUBLIC_GOOGLE_AUTH: process.env.NEXT_PUBLIC_GOOGLE_AUTH,
  NEXT_PUBLIC_GITHUB_AUTH: process.env.NEXT_PUBLIC_GITHUB_AUTH,
  NEXT_PUBLIC_FACEBOOK_AUTH: process.env.NEXT_PUBLIC_FACEBOOK_AUTH,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT
    ? parseInt(process.env.EMAIL_SERVER_PORT, 10)
    : undefined,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_BILLING_URL: process.env.NEXT_PUBLIC_STRIPE_BILLING_URL,
  NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_ACCESS_KEY: process.env.CLOUDFLARE_ACCESS_KEY,
  CLOUDFLARE_SECRET_KEY: process.env.CLOUDFLARE_SECRET_KEY,
  CLOUDFLARE_BUCKET: process.env.CLOUDFLARE_BUCKET,
  CLOUDFLARE_URL: process.env.CLOUDFLARE_URL,
  CLOUDFLARE_REGION: process.env.CLOUDFLARE_REGION,
  NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE,
};

const env = envSchema.parse(processEnv);

export default env;
