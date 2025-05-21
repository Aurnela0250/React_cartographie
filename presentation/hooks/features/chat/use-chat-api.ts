import type { ChatResponse } from "@/core/entities/chat.entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChatHistoryQuery() {
    return useQuery({
        queryKey: ["chat-history"],
        queryFn: async () => {
            const res = await fetch("/api/chat/history");

            if (!res.ok)
                throw new Error("Erreur lors du chargement de l'historique");

            return res.json();
        },
        staleTime: 1000 * 60, // 1 min
    });
}

export function useSendChatMessageMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: string) => {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) throw new Error("Erreur lors de l'envoi du message");

            return res.json() as Promise<ChatResponse>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat-history"] });
        },
    });
}
