export type EstablishmentTypeArgs = {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
};

export type IEstablishmentType = Partial<EstablishmentTypeArgs>;

export class EstablishmentType implements IEstablishmentType {
    id?: number;
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IEstablishmentType) {
        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): EstablishmentType {
        return new EstablishmentType(data as IEstablishmentType);
    }
}
