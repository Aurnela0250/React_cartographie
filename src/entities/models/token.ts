import { z } from "zod";

// Zod schema for Token Payload (claims part of the token)
export const TokenPayloadSchema = z.object({
    userId: z.number().positive(),
    exp: z.number(),
    iat: z.number(),
    jti: z.string(),
    tokenType: z.string(),
    iss: z.string(),
    aud: z.string(),
});

// Zod schema for complete Token (payload + access/refresh tokens)
export const TokenSchema = TokenPayloadSchema.extend({
    accessToken: z.string(),
    refreshToken: z.string(),
});

// Type inference from Zod schemas
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type Token = z.infer<typeof TokenSchema>;
