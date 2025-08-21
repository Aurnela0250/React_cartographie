import { z } from "zod";

// Zod schema for Establishment validation
export const EstablishmentSchema = z.object({
    id: z.number(),
    name: z.string(),
    acronym: z.string().optional(),
    address: z.string().optional(),
    contacts: z.array(z.string()).optional(),
    emails: z.array(z.string()).optional(),
    website: z.string().url().optional(),
    description: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    establishmentTypeId: z.number(),
    cityId: z.number(),
    establishmentType: z.any().optional(), // Will be refined when other models are converted
    city: z.any().optional(), // Will be refined when other models are converted
    formations: z.array(z.any()).optional(), // Will be refined when other models are converted
});

export type Establishment = z.infer<typeof EstablishmentSchema>;
