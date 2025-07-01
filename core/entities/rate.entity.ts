export type RateArgs = {
    id: number;
    establishmentId: number;
    userId: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
};

export type IRate = Partial<RateArgs>;

export class Rate implements IRate {
    id?: number;
    establishmentId?: number;
    userId?: number;
    rating?: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(args: IRate) {
        this.id = args.id;
        this.establishmentId = args.establishmentId;
        this.userId = args.userId;
        this.rating = args.rating;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
    }

    static fromUnknown(data: unknown): Rate {
        return new Rate(data as IRate);
    }
}
