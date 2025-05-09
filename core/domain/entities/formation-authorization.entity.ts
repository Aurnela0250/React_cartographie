export type FormationAuthorizationArgs = {
    id: number;
    date_debut: string;
    date_fin: string;
    status: string;
    arrete: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IFormationAuthorization = Partial<FormationAuthorizationArgs>;

export class FormationAuthorization implements IFormationAuthorization {
    id?: number;
    date_debut?: string;
    date_fin?: string;
    status?: string;
    arrete?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IFormationAuthorization) {
        this.id = args.id;
        this.date_debut = args.date_debut;
        this.date_fin = args.date_fin;
        this.status = args.status;
        this.arrete = args.arrete;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): FormationAuthorization {
        return new FormationAuthorization(data as IFormationAuthorization);
    }
}
