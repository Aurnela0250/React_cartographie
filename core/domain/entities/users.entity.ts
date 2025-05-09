export type UserArgs = {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: Date;
    updatedAt: Date;
};

export type IUser = Partial<UserArgs>;

export class User implements IUser {
    id?: number;
    name?: string;
    email?: string;
    active?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(args: IUser) {
        this.id = args.id;
        this.name = args.name;
        this.email = args.email;
        this.active = args.active;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
    }

    static fromUnknown(data: unknown): User {
        return new User(data as Partial<UserArgs>);
    }
}
