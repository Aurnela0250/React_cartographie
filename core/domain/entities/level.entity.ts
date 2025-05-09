export type LevelArgs = {
    id: number;
    name: string;
    acronyme: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
};

export type ILevel = Partial<LevelArgs>;

export class Level implements ILevel {
    id?: number;
    name?: string;
    acronyme?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    constructor(args: ILevel) {
        this.id = args.id;
        this.name = args.name;
        this.acronyme = args.acronyme;
        this.created_at = args.created_at;
        this.updated_at = args.updated_at;
        this.created_by = args.created_by;
        this.updated_by = args.updated_by;
    }

    static fromUnknown(data: unknown): Level {
        return new Level(data as ILevel);
    }
}
