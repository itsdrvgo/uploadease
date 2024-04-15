import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z
            .string()
            .url()
            .regex(/postgres/),

        GOOGLE_CLIENT_ID: z.string(1, "Missing GOOGLE_CLIENT_ID"),
        GOOGLE_PROJECT_ID: z.string(1, "Missing GOOGLE_PROJECT_ID"),
        GOOGLE_AUTH_URI: z.string().url(),
        GOOGLE_TOKEN_URI: z.string().url(),
        GOOGLE_AUTH_PROVIDER_X509_CERT_URL: z.string().url(),

        UPLOADTHING_SECRET: z
            .string(1, "Missing UPLOADTHING_SECRET")
            .regex(/^sk_/),
        UPLOADTHING_APP_ID: z.string(),

        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),

        MUX_TOKEN_ID: z.string(),
        MUX_TOKEN_SECRET: z.string(),
    },
    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

        DATABASE_URL: process.env.DATABASE_URL,

        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
        GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
        GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
        GOOGLE_AUTH_PROVIDER_X509_CERT_URL:
            process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,

        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,

        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

        MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
        MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    },
});
