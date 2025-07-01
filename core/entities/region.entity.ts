export type RegionArgs = {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
};

export type IRegion = Partial<RegionArgs>;

export class Region implements IRegion {
    id?: number;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IRegion) {
        this.id = args.id;
        this.name = args.name;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): Region {
        return new Region(data as IRegion);
    }
}
