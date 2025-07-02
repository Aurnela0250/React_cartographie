import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

// Pour NextAuth v5, nous n'avons plus besoin de SessionProvider côté client
// La session est gérée automatiquement par le middleware et les callbacks
export function AuthProvider({ children }: AuthProviderProps) {
    return <>{children}</>;
}
