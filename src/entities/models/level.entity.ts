import { z } from "zod";

// Zod schema for Level validation
export const LevelSchema = z.object({
    id: z.number(),
    name: z.string(),
    acronym: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type Level = z.infer<typeof LevelSchema>;
