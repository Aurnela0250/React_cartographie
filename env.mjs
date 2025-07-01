import { z } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    server: {
        NODE_ENV: z.string().optional(),
        API_PREFIX_URL: z.string().default("http://localhost:8000/api"),
        API_VERSION: z.string().default("v1"),
        AUTH_SECRET: z.string().min(1),
    },
    client: {
        API_PREFIX_URL: z.string().default("http://localhost:8000/api"),
        API_VERSION: z.string().default("v1"),
        MAP_API_KEY: z.string().default("get_your_own_D6rA4zTHduk6KOKTXzGB"),
        NEXT_PUBLIC_MAP_API_KEY: z.string().min(1),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        API_PREFIX_URL: process.env.API_PREFIX_URL,
        API_VERSION: process.env.API_VERSION,
        AUTH_SECRET: process.env.AUTH_SECRET,
        MAP_API_KEY: process.env.MAP_API_KEY,
        NEXT_PUBLIC_MAP_API_KEY: process.env.NEXT_PUBLIC_MAP_API_KEY,
    },
});
