export type CityArgs = {
    id: number;
    name: string;
    regionId: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
};

export type ICity = Partial<CityArgs>;

export class City implements ICity {
    id?: number;
    name?: string;
    regionId?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: ICity) {
        this.id = args.id;
        this.name = args.name;
        this.regionId = args.regionId;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): City {
        return new City(data as ICity);
    }
}
