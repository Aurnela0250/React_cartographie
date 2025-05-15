export type AnnualHeadcountArgs = {
    id: number;
    academicYear: number;
    students: number;
    formationId: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
};

export type IAnnualHeadcount = Partial<AnnualHeadcountArgs>;

export class AnnualHeadcount implements IAnnualHeadcount {
    id?: number;
    academicYear?: number;
    students?: number;
    formationId?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IAnnualHeadcount) {
        this.id = args.id;
        this.academicYear = args.academicYear;
        this.students = args.students;
        this.formationId = args.formationId;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): AnnualHeadcount {
        return new AnnualHeadcount(data as IAnnualHeadcount);
    }
}
