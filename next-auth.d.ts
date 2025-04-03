import { DefaultSession } from "next-auth";

import { UserLogged } from "@/presentation/schemas/auth.schema";

declare module "next-auth" {
    interface Session {
        user: {} & DefaultSession["user"];
    }
    interface User extends UserLogged {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: UserLogged;
    }
}
