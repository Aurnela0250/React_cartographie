export type LevelArgs = {
    id: number;
    name: string;
    acronym?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
};

export type ILevel = Partial<LevelArgs>;

export class Level implements ILevel {
    id?: number;
    name?: string;
    acronym?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;

    constructor(args: ILevel) {
        this.id = args.id;
        this.name = args.name;
        this.acronym = args.acronym;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
    }

    static fromUnknown(data: unknown): Level {
        return new Level(data as ILevel);
    }
}
