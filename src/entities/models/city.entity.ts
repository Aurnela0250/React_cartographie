import { z } from "zod";

// Zod schema for City validation
export const CitySchema = z.object({
    id: z.number(),
    name: z.string(),
    regionId: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type City = z.infer<typeof CitySchema>;

// Static class for compatibility with PaginatedResult.mapItemsToEntity
export class CityEntity {
    /**
     * Creates a City instance from unknown data using Zod validation
     * @param data Unknown data to transform into a City
     * @returns Parsed and validated City object
     */
    static fromUnknown(data: unknown): City {
        return CitySchema.parse(data);
    }
}
