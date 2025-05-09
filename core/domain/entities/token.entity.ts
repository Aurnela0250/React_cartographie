import { IUser, User } from "./users.entity";

type TokenArgs = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    exp: number;
    iat: number;
    user: IUser;
};

export type IToken = Partial<TokenArgs>;

export class Token implements IToken {
    accessToken?: string;
    refreshToken?: string;
    exp?: number;
    iat?: number;
    user?: IUser;

    constructor(args: IToken) {
        this.accessToken = args.accessToken;
        this.refreshToken = args.refreshToken;
        this.exp = args.exp;
        this.iat = args.iat;
        this.user = args.user;
    }

    static fromUnknown(data: unknown): Token {
        return new Token(data as IToken);
    }

    setUser(user?: IUser) {
        if (user) {
            this.user = User.fromUnknown(user);
        }
    }
}
