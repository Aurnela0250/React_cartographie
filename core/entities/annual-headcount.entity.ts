export type AnnualHeadcountArgs = {
    id: number;
    formationId: number;
    academicYear: number;
    students: number;
    successRate?: number;
    createdAt: string;
    updatedAt: string;
    createdBy?: number;
    updatedBy?: number;
};

export type IAnnualHeadcount = Partial<AnnualHeadcountArgs>;

export class AnnualHeadcount implements IAnnualHeadcount {
    id?: number;
    formationId?: number;
    academicYear?: number;
    students?: number;
    successRate?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: IAnnualHeadcount) {
        this.id = args.id;
        this.formationId = args.formationId;
        this.academicYear = args.academicYear;
        this.students = args.students;
        this.successRate = args.successRate;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): AnnualHeadcount {
        return new AnnualHeadcount(data as IAnnualHeadcount);
    }
}
