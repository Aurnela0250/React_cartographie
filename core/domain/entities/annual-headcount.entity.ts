export type AnnualHeadcountArgs = {
    id: number;
    academic_year: number;
    students: number;
    formation_id: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type IAnnualHeadcount = Partial<AnnualHeadcountArgs>;

export class AnnualHeadcount implements IAnnualHeadcount {
    id?: number;
    academic_year?: number;
    students?: number;
    formation_id?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: IAnnualHeadcount) {
        this.id = args.id;
        this.academic_year = args.academic_year;
        this.students = args.students;
        this.formation_id = args.formation_id;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): AnnualHeadcount {
        return new AnnualHeadcount(data as IAnnualHeadcount);
    }
}
