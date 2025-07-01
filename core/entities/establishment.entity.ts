import { ICity } from "./city.entity";
import { IEstablishmentType } from "./establishment-type.entity";
import { IFormation } from "./formation.entity";

export type EstablishmentArgs = {
    id: number;
    name: string;
    acronym?: string;
    address?: string;
    contacts?: string[];
    website?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishmentTypeId: number;
    cityId: number;
    establishmentType?: IEstablishmentType;
    city?: ICity;
    formations?: IFormation[];
};

export type IEstablishment = Partial<EstablishmentArgs>;

export class Establishment implements IEstablishment {
    id?: number;
    name?: string;
    acronym?: string;
    address?: string;
    contacts?: string[];
    website?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishmentTypeId?: number;
    cityId?: number;
    establishmentType?: IEstablishmentType;
    city?: ICity;
    formations?: IFormation[];

    constructor(args: IEstablishment) {
        this.id = args.id;
        this.name = args.name;
        this.acronym = args.acronym;
        this.address = args.address;
        this.contacts = args.contacts;
        this.website = args.website;
        this.description = args.description;
        this.latitude = args.latitude;
        this.longitude = args.longitude;
        this.establishmentTypeId = args.establishmentTypeId;
        this.cityId = args.cityId;
        this.setEstablishmentType(args.establishmentType);
        this.setCity(args.city);
        this.setFormations(args.formations);
    }

    setEstablishmentType(establishmentType?: IEstablishmentType) {
        this.establishmentType = establishmentType;
    }

    setCity(city?: ICity) {
        this.city = city;
    }

    setFormations(formations?: IFormation[]) {
        this.formations = formations || [];
    }

    static fromUnknown(data: unknown): Establishment {
        return new Establishment(data as IEstablishment);
    }
}
