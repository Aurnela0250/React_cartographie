export type MentionArgs = {
    id: number;
    name: string;
    domain_id: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IMention = Partial<MentionArgs>;

export class Mention implements IMention {
    id?: number;
    name?: string;
    domain_id?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IMention) {
        this.id = args.id;
        this.name = args.name;
        this.domain_id = args.domain_id;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Mention {
        return new Mention(data as IMention);
    }
}
