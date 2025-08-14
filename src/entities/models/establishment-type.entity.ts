import { z } from 'zod';

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

// Partial schema for EstablishmentType updates/creation
export const PartialEstablishmentTypeSchema = EstablishmentTypeSchema.partial();

// Type inference from Zod schemas
export type IEstablishmentType = z.infer<typeof EstablishmentTypeSchema>;
export type IPartialEstablishmentType = z.infer<typeof PartialEstablishmentTypeSchema>;

export class EstablishmentType implements IEstablishmentType {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IEstablishmentType) {
        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): EstablishmentType {
        const validatedData = EstablishmentTypeSchema.parse(data);
        return new EstablishmentType(validatedData);
    }

    static validate(data: unknown): IEstablishmentType {
        return EstablishmentTypeSchema.parse(data);
    }

    static validatePartial(data: unknown): IPartialEstablishmentType {
        return PartialEstablishmentTypeSchema.parse(data);
    }
}
