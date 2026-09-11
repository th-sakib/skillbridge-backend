import z from "zod";
import { ApiError } from "../utils/ApiError";

const envSchema = z.object({
  SECRET_KEY: z.string(),
  BASE_URL: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.string(),
  GAPP_USER: z.string(),
  GAPP_PASS: z.string(),
  NODE_ENV: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new ApiError("required env not found", 500);
}

export const env = parsed;
