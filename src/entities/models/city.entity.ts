import { z } from "zod";

// Zod schema for City validation
export const CitySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string().optional(),
    regionId: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type City = z.infer<typeof CitySchema>;
