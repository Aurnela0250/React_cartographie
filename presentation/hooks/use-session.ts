import { SessionData } from "@/shared/utils/auth";
import { useQuery } from "@tanstack/react-query";

// Fonction pour récupérer les données de session depuis l'API
const fetchSession = async (): Promise<SessionData | null> => {
    try {
        const response = await fetch("/api/session");

        if (!response.ok) {
            console.error(
                "Échec de récupération de la session:",
                response.status,
                response.statusText
            );

            return null;
        }

        const data = await response.json();

        if (typeof data?.isLoggedIn === "boolean") {
            return data as SessionData;
        }

        console.error("Format de données de session invalide:", data);

        return null;
    } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error);

        return null;
    }
};

export const useSession = () => {
    const {
        data: session,
        status,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<SessionData | null>({
        queryKey: ["session"],
        queryFn: fetchSession,
        staleTime: 5 * 60 * 1000, // Garder les données fraîches pendant 5 minutes
        refetchOnWindowFocus: true,
        retry: 1,
    });

    return {
        session,
        isLoading,
        isLoggedIn: session?.isLoggedIn ?? false,
        user: session?.user,
        status,
        isError,
        error,
        refetchSession: refetch,
    };
};
