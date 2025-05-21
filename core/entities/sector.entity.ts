export type SectorArgs = {
    id: number;
    name: string;
    cityId: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
};

export type ISector = Partial<SectorArgs>;

export class Sector implements ISector {
    id?: number;
    name?: string;
    cityId?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: ISector) {
        this.id = args.id;
        this.name = args.name;
        this.cityId = args.cityId;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): Sector {
        return new Sector(data as ISector);
    }
}
