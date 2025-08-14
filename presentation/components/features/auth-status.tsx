"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/presentation/components/ui/button";
import { triggerSessionUpdate } from "@/lib/auth-client";

/**
 * Composant de test pour démontrer le nouveau pattern Auth.js
 * Affiche l'état de session et permet de tester la synchronisation
 */
export default function AuthStatus() {
    const { data: session, status, update } = useSession();

    const handleRefresh = () => {
        update();
    };

    const handleTriggerUpdate = () => {
        triggerSessionUpdate();
    };

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">État de Session (Pattern Auth.js)</h3>
            
            <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {status}</p>
                <p><strong>User:</strong> {session?.user?.email || "Non connecté"}</p>
                <p><strong>Expires:</strong> {session?.expires || "N/A"}</p>
            </div>

            <div className="flex gap-2">
                <Button size="sm" onClick={handleRefresh}>
                    Refresh Session
                </Button>
                <Button size="sm" variant="outline" onClick={handleTriggerUpdate}>
                    Trigger Update
                </Button>
            </div>

            <div className="text-xs text-muted-foreground">
                <p>✅ Polling automatique toutes les 5 minutes</p>
                <p>✅ Refresh au focus de fenêtre</p>
                <p>✅ Synchronisation entre onglets</p>
            </div>
        </div>
    );
}