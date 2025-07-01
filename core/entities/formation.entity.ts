import { IAnnualHeadcount } from "./annual-headcount.entity";
import { IEstablishment } from "./establishment.entity";
import { IFormationAuthorization } from "./formation-authorization.entity";
import { ILevel } from "./level.entity";
import { IMention } from "./mention.entity";

export type FormationArgs = {
    id: number;
    name: string;
    description?: string;
    duration: number;
    levelId: number;
    mentionId: number;
    establishmentId: number;
    authorizationId?: number;
    level?: ILevel;
    mention?: IMention;
    establishment?: IEstablishment;
    authorization?: IFormationAuthorization;
    annualHeadcounts?: IAnnualHeadcount[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
};

export type IFormation = Partial<FormationArgs>;

export class Formation implements IFormation {
    id?: number;
    name?: string;
    description?: string;
    duration?: number;
    levelId?: number;
    mentionId?: number;
    establishmentId?: number;
    authorizationId?: number;
    level?: ILevel;
    mention?: IMention;
    establishment?: IEstablishment;
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

    setLevel(level?: ILevel) {
        this.level = level;
    }

    setMention(mention?: IMention) {
        this.mention = mention;
    }

    setEstablishment(establishment?: IEstablishment) {
        this.establishment = establishment;
    }

    setAuthorization(authorization?: IFormationAuthorization) {
        this.authorization = authorization;
    }

    setAnnualHeadcounts(annualHeadcounts?: IAnnualHeadcount[]) {
        this.annualHeadcounts = annualHeadcounts || [];
    }

    static fromUnknown(data: unknown): Formation {
        return new Formation(data as IFormation);
    }
}
