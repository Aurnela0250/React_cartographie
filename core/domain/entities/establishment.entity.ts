import { IEstablishmentType } from "./establishment-type.entity";
import { IFormation } from "./formation.entity";
import { ISector } from "./sector.entity";

export type EstablishmentArgs = {
    id: number;
    name: string;
    acronyme: string;
    address: string;
    contacts: string[];
    siteUrl: string;
    description: string;
    latitude: number;
    longitude: number;
    establishmentTypeId: number;
    sectorId: number;
    establishmentType?: IEstablishmentType;
    sector?: ISector;
    formations?: IFormation[];
    rating: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
};

export type IEstablishment = Partial<EstablishmentArgs>;

export class Establishment implements IEstablishment {
    id?: number;
    name?: string;
    acronyme?: string;
    address?: string;
    contacts?: string[];
    siteUrl?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishmentTypeId?: number;
    sectorId?: number;
    establishmentType?: IEstablishmentType;
    sector?: ISector;
    formations?: IFormation[];
    rating?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IEstablishment) {
        this.id = args.id;
        this.name = args.name;
        this.acronyme = args.acronyme;
        this.address = args.address;
        this.contacts = args.contacts;
        this.siteUrl = args.siteUrl;
        this.description = args.description;
        this.latitude = args.latitude;
        this.longitude = args.longitude;
        this.establishmentTypeId = args.establishmentTypeId;
        this.sectorId = args.sectorId;
        this.setEstablishmentType(args.establishmentType);
        this.setSector(args.sector);
        this.setFormations(args.formations);
        this.rating = args.rating;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    setEstablishmentType(establishmentType?: IEstablishmentType) {
        this.establishmentType = establishmentType;
    }

    setSector(sector?: ISector) {
        this.sector = sector;
    }

    setFormations(formations?: IFormation[]) {
        this.formations = formations;
    }

    static fromUnknown(data: unknown): Establishment {
        return new Establishment(data as IEstablishment);
    }
}
