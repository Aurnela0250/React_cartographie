import { z } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    server: {
        NODE_ENV: z.string().optional(),
        API_PREFIX_URL: z.string().default("http://localhost:8000/api"),
        API_VERSION: z.string().default("v1"),
        IRON_SESSION_PASSWORD: z.string().optional(),
    },
    client: {
        API_PREFIX_URL: z.string().default("http://localhost:8000/api"),
        API_VERSION: z.string().default("v1"),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        API_PREFIX_URL: process.env.API_PREFIX_URL,
        API_VERSION: process.env.API_VERSION,
        IRON_SESSION_PASSWORD: process.env.IRON_SESSION_PASSWORD,
    },
});
