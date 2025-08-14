import { z } from 'zod';

// Zod schema for Mention validation
export const MentionSchema = z.object({
    id: z.number(),
    name: z.string(),
    domainId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Partial schema for Mention updates/creation
export const PartialMentionSchema = MentionSchema.partial();

// Type inference from Zod schemas
export type MentionArgs = z.infer<typeof MentionSchema>;
export type IMention = z.infer<typeof PartialMentionSchema>;

export class Mention implements IMention {
    id?: number;
    name?: string;
    domainId?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IMention) {
        this.id = args.id;
        this.name = args.name;
        this.domainId = args.domainId;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): Mention {
        const validatedData = PartialMentionSchema.parse(data);
        return new Mention(validatedData);
    }

    static validate(data: unknown): MentionArgs {
        return MentionSchema.parse(data);
    }

    static validatePartial(data: unknown): IMention {
        return PartialMentionSchema.parse(data);
    }
}
