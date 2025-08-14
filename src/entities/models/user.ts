import { z } from "zod";

// Zod schema for User validation
export const UserSchema = z.object({
    id: z.number().positive(),
    email: z.string().email(),
    active: z.boolean(),
    isAdmin: z.boolean(),
    createdBy: z.number().positive(),
    updatedBy: z.number().positive(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Type inference from Zod schemas
export type User = z.infer<typeof UserSchema>;
