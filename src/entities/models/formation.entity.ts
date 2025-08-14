import { z } from "zod";

import { IAnnualHeadcount } from "./annual-headcount.entity";
import { Establishment } from "./establishment.entity";
import { IFormationAuthorization } from "./formation-authorization.entity";
import { Level } from "./level.entity";
import { IMention } from "./mention.entity";

// Zod schema for Formation validation
export const FormationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    duration: z.number(),
    levelId: z.number(),
    mentionId: z.number(),
    establishmentId: z.number(),
    authorizationId: z.number().optional(),
    level: z.any().optional(), // Will be refined when other models are converted
    mention: z.any().optional(), // Will be refined when other models are converted
    establishment: z.any().optional(), // Will be refined when other models are converted
    authorization: z.any().optional(), // Will be refined when other models are converted
    annualHeadcounts: z.array(z.any()).optional(), // Will be refined when other models are converted
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Partial schema for Formation updates/creation
export const PartialFormationSchema = FormationSchema.partial();

// Type inference from Zod schemas
export type FormationArgs = z.infer<typeof FormationSchema>;
export type IFormation = z.infer<typeof PartialFormationSchema>;

export class Formation implements IFormation {
    id?: number;
    name?: string;
    description?: string;
    duration?: number;
    levelId?: number;
    mentionId?: number;
    establishmentId?: number;
    authorizationId?: number;
    level?: Level;
    mention?: IMention;
    establishment?: Establishment;
    authorization?: IFormationAuthorization;
    annualHeadcounts?: IAnnualHeadcount[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IFormation) {
        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.duration = args.duration;
        this.levelId = args.levelId;
        this.mentionId = args.mentionId;
        this.establishmentId = args.establishmentId;
        this.authorizationId = args.authorizationId;
        this.setLevel(args.level);
        this.setMention(args.mention);
        this.setEstablishment(args.establishment);
        this.setAuthorization(args.authorization);
        this.setAnnualHeadcounts(args.annualHeadcounts);
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    setLevel(level?: Level) {
        this.level = level;
    }

    setMention(mention?: IMention) {
        this.mention = mention;
    }

    setEstablishment(establishment?: Establishment) {
        this.establishment = establishment;
    }

    setAuthorization(authorization?: IFormationAuthorization) {
        this.authorization = authorization;
    }

    setAnnualHeadcounts(annualHeadcounts?: IAnnualHeadcount[]) {
        this.annualHeadcounts = annualHeadcounts || [];
    }

    static fromUnknown(data: unknown): Formation {
        const validatedData = PartialFormationSchema.parse(data);
        return new Formation(validatedData);
    }

    static validate(data: unknown): FormationArgs {
        return FormationSchema.parse(data);
    }

    static validatePartial(data: unknown): IFormation {
        return PartialFormationSchema.parse(data);
    }
}
