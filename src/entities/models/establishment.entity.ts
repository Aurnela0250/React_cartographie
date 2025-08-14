import { z } from "zod";

import { City } from "./city.entity";
import { IEstablishmentType } from "./establishment-type.entity";
import { IFormation } from "./formation.entity";

// Zod schema for Establishment validation
export const EstablishmentSchema = z.object({
    id: z.number(),
    name: z.string(),
    acronym: z.string().optional(),
    address: z.string().optional(),
    contacts: z.array(z.string()).optional(),
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

// Partial schema for Establishment updates/creation
export const PartialEstablishmentSchema = EstablishmentSchema.partial();

// Type inference from Zod schemas
export type Establishment = z.infer<typeof EstablishmentSchema>;
