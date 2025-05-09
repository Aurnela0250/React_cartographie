import { IAnnualHeadcount } from "./annual-headcount.entity";
import { IEstablishment } from "./establishment.entity";
import { IFormationAuthorization } from "./formation-authorization.entity";
import { ILevel } from "./level.entity";
import { IMention } from "./mention.entity";

export type FormationArgs = {
    id: number;
    intitule: string;
    description: string;
    duration: number;
    level_id: number;
    mention_id: number;
    establishment_id: number;
    authorization_id: number;
    level?: ILevel;
    mention?: IMention;
    establishment?: IEstablishment;
    authorization?: IFormationAuthorization;
    annual_headcounts?: IAnnualHeadcount[];
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IFormation = Partial<FormationArgs>;

export class Formation implements IFormation {
    id?: number;
    intitule?: string;
    description?: string;
    duration?: number;
    level_id?: number;
    mention_id?: number;
    establishment_id?: number;
    authorization_id?: number;
    level?: ILevel;
    mention?: IMention;
    establishment?: IEstablishment;
    authorization?: IFormationAuthorization;
    annual_headcounts?: IAnnualHeadcount[];
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IFormation) {
        this.id = args.id;
        this.intitule = args.intitule;
        this.description = args.description;
        this.duration = args.duration;
        this.level_id = args.level_id;
        this.mention_id = args.mention_id;
        this.establishment_id = args.establishment_id;
        this.authorization_id = args.authorization_id;
        this.level = args.level;
        this.mention = args.mention;
        this.establishment = args.establishment;
        this.authorization = args.authorization;
        this.annual_headcounts = args.annual_headcounts;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Formation {
        return new Formation(data as IFormation);
    }
}
