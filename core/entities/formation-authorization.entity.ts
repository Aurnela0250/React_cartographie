export type FormationAuthorizationArgs = {
    id: number;
    dateDebut: string;
    dateFin?: string;
    status: string;
    decree?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
};

export type IFormationAuthorization = Partial<FormationAuthorizationArgs>;

export class FormationAuthorization implements IFormationAuthorization {
    id?: number;
    dateDebut?: string;
    dateFin?: string;
    status?: string;
    decree?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IFormationAuthorization) {
        this.id = args.id;
        this.dateDebut = args.dateDebut;
        this.dateFin = args.dateFin;
        this.status = args.status;
        this.decree = args.decree;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): FormationAuthorization {
        return new FormationAuthorization(data as IFormationAuthorization);
    }
}
