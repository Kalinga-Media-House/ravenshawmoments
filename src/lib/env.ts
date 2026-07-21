import { z } from "zod";

const isServer = typeof window === "undefined";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().trim().default("dummy"),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().trim().default("dummy"),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().trim().default("dummy"),
  CLOUDFLARE_R2_BUCKET: z.string().trim().default("dummy"),
});

const schema = isServer ? clientSchema.merge(serverSchema) : clientSchema;

const processEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV,
  ...(isServer && {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET: process.env.CLOUDFLARE_R2_BUCKET,
  }),
};

const parsedEnv = schema.safeParse(processEnv);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  parsedEnv.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    console.error(`  ❌ [${path}]: ${issue.message}`);
  });
  throw new Error("Invalid environment variables");
}

export type Env = z.infer<typeof clientSchema> & z.infer<typeof serverSchema>;

export const env: Env = isServer
  ? (parsedEnv.data as Env)
  : ({
      ...parsedEnv.data,
      SUPABASE_SERVICE_ROLE_KEY: "",
      CLOUDFLARE_R2_ACCOUNT_ID: "",
      CLOUDFLARE_R2_ACCESS_KEY_ID: "",
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: "",
      CLOUDFLARE_R2_BUCKET: "",
    } as Env);
