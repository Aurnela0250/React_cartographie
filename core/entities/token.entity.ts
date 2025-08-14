import { IUser, User } from "./users.entity";

export type IToken = {
    userId: number;
    exp: number;
    iat: number;
    jti: string;
    tokenType: string;
    iss: string;
    aud: string;
    accessToken: string;
    refreshToken: string;
    user: IUser;
};

export class Token implements IToken {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    userId: number;
    jti: string;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
    user: IUser;

    constructor(args: IToken) {
        this.accessToken = args.accessToken;
        this.refreshToken = args.refreshToken;
        this.tokenType = args.tokenType || "Bearer";
        this.userId = args.userId;
        this.jti = args.jti;
        this.iss = args.iss;
        this.aud = args.aud;
        this.iat = args.iat;
        this.exp = args.exp;
        this.user = User.fromUnknown(args.user);
    }

    /**
     * Vérifie si le token est expiré
     */
    isExpired(): boolean {
        if (this.exp) {
            return (
                Date.UTC(
                    new Date().getUTCFullYear(),
                    new Date().getUTCMonth(),
                    new Date().getUTCDate(),
                    new Date().getUTCHours(),
                    new Date().getUTCMinutes(),
                    new Date().getUTCSeconds(),
                    new Date().getUTCMilliseconds()
                ) >=
                this.exp * 1000
            );
        }

        return false;
    }

    /**
     * Calcule le temps restant avant expiration en millisecondes
     */
    getTimeUntilExpiry(): number {
        if (this.exp) {
            return Math.max(0, this.exp * 1000 - Date.now());
        }

        return 0;
    }

    /**
     * Crée une instance Token à partir de données inconnues
     */
    static fromUnknown(data: unknown): Token {
        return new Token(data as IToken);
    }

    setUser(user: IUser) {
        this.user = user;
    }
}
