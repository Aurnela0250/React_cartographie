export type CityArgs = {
    id: number;
    name: string;
    region_id: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type ICity = Partial<CityArgs>;

export class City implements ICity {
    id?: number;
    name?: string;
    region_id?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: ICity) {
        this.id = args.id;
        this.name = args.name;
        this.region_id = args.region_id;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): City {
        return new City(data as ICity);
    }
}
