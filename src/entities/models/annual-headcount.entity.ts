import { z } from 'zod';

// Zod schema for AnnualHeadcount validation
export const AnnualHeadcountSchema = z.object({
    id: z.number(),
    formationId: z.number(),
    academicYear: z.number(),
    students: z.number(),
    successRate: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Partial schema for AnnualHeadcount updates/creation
export const PartialAnnualHeadcountSchema = AnnualHeadcountSchema.partial();

// Type inference from Zod schemas
export type AnnualHeadcountArgs = z.infer<typeof AnnualHeadcountSchema>;
export type IAnnualHeadcount = z.infer<typeof PartialAnnualHeadcountSchema>;

export class AnnualHeadcount implements IAnnualHeadcount {
    id?: number;
    formationId?: number;
    academicYear?: number;
    students?: number;
    successRate?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IAnnualHeadcount) {
        this.id = args.id;
        this.formationId = args.formationId;
        this.academicYear = args.academicYear;
        this.students = args.students;
        this.successRate = args.successRate;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): AnnualHeadcount {
        const validatedData = PartialAnnualHeadcountSchema.parse(data);
        return new AnnualHeadcount(validatedData);
    }

    static validate(data: unknown): AnnualHeadcountArgs {
        return AnnualHeadcountSchema.parse(data);
    }

    static validatePartial(data: unknown): IAnnualHeadcount {
        return PartialAnnualHeadcountSchema.parse(data);
    }
}
