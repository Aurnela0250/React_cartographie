import { z } from "zod";

// Zod schema for EstablishmentType validation
export const EstablishmentTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type EstablishmentType = z.infer<typeof EstablishmentTypeSchema>;
