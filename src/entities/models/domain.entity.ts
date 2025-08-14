import { z } from "zod";

// Zod schema for Domain validation
export const DomainSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type Domain = z.infer<typeof DomainSchema>;
