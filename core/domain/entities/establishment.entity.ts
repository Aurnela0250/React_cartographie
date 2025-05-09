import { IEstablishmentType } from "./establishment-type.entity";
import { IFormation } from "./formation.entity";
import { ISector } from "./sector.entity";

export type EstablishmentArgs = {
    id: number;
    name: string;
    acronyme: string;
    address: string;
    contacts: string[];
    site_url: string;
    description: string;
    latitude: number;
    longitude: number;
    establishment_type_id: number;
    sector_id: number;
    establishment_type?: IEstablishmentType;
    sector?: ISector;
    formations?: IFormation[];
    rating: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IEstablishment = Partial<EstablishmentArgs>;

export class Establishment implements IEstablishment {
    id?: number;
    name?: string;
    acronyme?: string;
    address?: string;
    contacts?: string[];
    site_url?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishment_type_id?: number;
    sector_id?: number;
    establishment_type?: IEstablishmentType;
    sector?: ISector;
    formations?: IFormation[];
    rating?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IEstablishment) {
        this.id = args.id;
        this.name = args.name;
        this.acronyme = args.acronyme;
        this.address = args.address;
        this.contacts = args.contacts;
        this.site_url = args.site_url;
        this.description = args.description;
        this.latitude = args.latitude;
        this.longitude = args.longitude;
        this.establishment_type_id = args.establishment_type_id;
        this.sector_id = args.sector_id;
        this.establishment_type = args.establishment_type;
        this.sector = args.sector;
        this.formations = args.formations;
        this.rating = args.rating;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Establishment {
        return new Establishment(data as IEstablishment);
    }
}
