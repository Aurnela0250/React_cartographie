export type IUser = {
    id: number;
    email: string;
    active: boolean;
    isAdmin: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
};

export class User implements IUser {
    id: number;
    email: string;
    active: boolean;
    isAdmin: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;

    constructor(args: IUser) {
        this.id = args.id;
        this.email = args.email;
        this.active = args.active;
        this.isAdmin = args.isAdmin;
        this.createdBy = args.createdBy;
        this.updatedBy = args.updatedBy;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
    }

    static fromUnknown(data: unknown): User {
        return new User(data as IUser);
    }
}
