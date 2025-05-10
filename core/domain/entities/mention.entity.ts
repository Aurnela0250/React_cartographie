export type MentionArgs = {
    id: number;
    name: string;
    domainId: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
};

export type IMention = Partial<MentionArgs>;

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
        return new Mention(data as IMention);
    }
}
