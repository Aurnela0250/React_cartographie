import { z } from 'zod';

// Zod schema for Rate validation
export const RateSchema = z.object({
    id: z.number(),
    establishmentId: z.number(),
    userId: z.number(),
    rating: z.number().min(1).max(5), // Assuming rating is between 1-5
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

// Partial schema for Rate updates/creation
export const PartialRateSchema = RateSchema.partial();

// Type inference from Zod schemas
export type IRate = z.infer<typeof RateSchema>;
export type IPartialRate = z.infer<typeof PartialRateSchema>;

export class Rate implements IRate {
    id: number;
    establishmentId: number;
    userId: number;
    rating: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(args: IRate) {
        this.id = args.id;
        this.establishmentId = args.establishmentId;
        this.userId = args.userId;
        this.rating = args.rating;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
    }

    static fromUnknown(data: unknown): Rate {
        const validatedData = RateSchema.parse(data);
        return new Rate(validatedData);
    }

    static validate(data: unknown): IRate {
        return RateSchema.parse(data);
    }

    static validatePartial(data: unknown): IPartialRate {
        return PartialRateSchema.parse(data);
    }
}
