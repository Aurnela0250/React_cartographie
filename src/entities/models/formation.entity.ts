import { z } from "zod";

import { EstablishmentSchema } from "./establishment.entity";
import { FormationAuthorizationSchema } from "./formation-authorization.entity";
import { LevelSchema } from "./level.entity";
import { MentionSchema } from "./mention.entity";

// Zod schema for Formation validation
export const FormationSchema = z.object({
    id: z.number(),
    name: z.string(),
    link: z.string().optional(),
    description: z.string().optional(),
    duration: z.number(), // La durée ici est représenter en nombre de mois
    levelId: z.number(),
    mentionId: z.number(),
    establishmentId: z.number(),
    authorizationId: z.number().optional(),
    level: LevelSchema.optional(),
    mention: MentionSchema.optional(),
    establishment: EstablishmentSchema.optional(),
    authorization: FormationAuthorizationSchema.optional(),
    annualHeadcounts: z.array(z.any()).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});

// Type inference from Zod schemas
export type Formation = z.infer<typeof FormationSchema>;
