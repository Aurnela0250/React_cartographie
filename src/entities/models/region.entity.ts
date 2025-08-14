import { z } from "zod";

// Zod schema for Region validation
export const RegionSchema = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type Region = z.infer<typeof RegionSchema>;

// Static class for compatibility with PaginatedResult.mapItemsToEntity
export class RegionEntity {
    /**
     * Creates a Region instance from unknown data using Zod validation
     * @param data Unknown data to transform into a Region
     * @returns Parsed and validated Region object
     */
    static fromUnknown(data: unknown): Region {
        return RegionSchema.parse(data);
    }
}
