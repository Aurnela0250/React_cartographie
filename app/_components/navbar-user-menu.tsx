import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";
import type { User } from "@/src/entities/models/user";
import UserMenuDropdown from "./user-menu-dropdown";

/**
 * Fonction pour récupérer les informations utilisateur
 * Inspirée de l'implémentation dans establishment-formations.tsx
 */
async function getUserInfo(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return null;
        }

        const getUserInfoController = getInjection("IGetUserInfoController");
        const user = await getUserInfoController(accessToken);

        return user;
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect("/login");
        }
        throw error;
    }
}

/**
 * Composant serveur principal du menu utilisateur dans la navbar
 * Récupère les données utilisateur et les passe au composant client
 */
export default async function NavbarUserMenu() {
    const user = await getUserInfo();
    
    if (!user) {
        redirect("/login");
    }
    
    return <UserMenuDropdown user={user} />;
}

// Export de la fonction getUserInfo pour utilisation dans d'autres composants
export { getUserInfo };
