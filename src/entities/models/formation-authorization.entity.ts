import { z } from 'zod';

// Zod schema for FormationAuthorization validation
export const FormationAuthorizationSchema = z.object({
    id: z.number(),
    dateDebut: z.string(),
    dateFin: z.string().optional(),
    status: z.string(),
    decree: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Partial schema for FormationAuthorization updates/creation
export const PartialFormationAuthorizationSchema = FormationAuthorizationSchema.partial();

// Type inference from Zod schemas
export type FormationAuthorizationArgs = z.infer<typeof FormationAuthorizationSchema>;
export type IFormationAuthorization = z.infer<typeof PartialFormationAuthorizationSchema>;

export class FormationAuthorization implements IFormationAuthorization {
    id?: number;
    dateDebut?: string;
    dateFin?: string;
    status?: string;
    decree?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IFormationAuthorization) {
        this.id = args.id;
        this.dateDebut = args.dateDebut;
        this.dateFin = args.dateFin;
        this.status = args.status;
        this.decree = args.decree;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): FormationAuthorization {
        const validatedData = PartialFormationAuthorizationSchema.parse(data);
        return new FormationAuthorization(validatedData);
    }

    static validate(data: unknown): FormationAuthorizationArgs {
        return FormationAuthorizationSchema.parse(data);
    }

    static validatePartial(data: unknown): IFormationAuthorization {
        return PartialFormationAuthorizationSchema.parse(data);
    }
}
