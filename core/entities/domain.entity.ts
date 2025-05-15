export type DomainArgs = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
};

export type IDomain = Partial<DomainArgs>;

export class Domain implements IDomain {
    id?: number;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IDomain) {
        this.id = args.id;
        this.name = args.name;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): Domain {
        return new Domain(data as IDomain);
    }
}
