export type SectorArgs = {
    id: number;
    name: string;
    city_id: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type ISector = Partial<SectorArgs>;

export class Sector implements ISector {
    id?: number;
    name?: string;
    city_id?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: ISector) {
        this.id = args.id;
        this.name = args.name;
        this.city_id = args.city_id;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Sector {
        return new Sector(data as ISector);
    }
}
