export type RegionArgs = {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IRegion = Partial<RegionArgs>;

export class Region implements IRegion {
    id?: number;
    name?: string;
    code?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IRegion) {
        this.id = args.id;
        this.name = args.name;
        this.code = args.code;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Region {
        return new Region(data as IRegion);
    }
}
