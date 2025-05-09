export type DomainArgs = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IDomain = Partial<DomainArgs>;

export class Domain implements IDomain {
    id?: number;
    name?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IDomain) {
        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Domain {
        return new Domain(data as IDomain);
    }
}
