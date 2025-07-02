export type IRegion = {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;
};

export class Region implements IRegion {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IRegion) {
        this.id = args.id;
        this.name = args.name;
        this.createdAt = args.createdAt ? new Date(args.createdAt) : undefined;
        this.updatedAt = args.updatedAt ? new Date(args.updatedAt) : undefined;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): Region {
        return new Region(data as IRegion);
    }
}
