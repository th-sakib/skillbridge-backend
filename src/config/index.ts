import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string(),
});

const parsed = envSchema.parse(process.env);

export const env = parsed;
