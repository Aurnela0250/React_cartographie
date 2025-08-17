import { Button } from "@/presentation/components/ui/button";
import { Label } from "@/presentation/components/ui/label";

interface CitySelectorLoginRequiredProps {
    error: string;
}

/**
 * Composant pour les cas où l'authentification est requise
 * Affiche un message d'erreur avec un bouton de reconnexion
 */
export function CitySelectorLoginRequired({ error }: CitySelectorLoginRequiredProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="city-selector-login">Villes</Label>
            <div className="space-y-2">
                <div className="text-sm text-amber-600">
                    {error}
                </div>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/login'}
                >
                    Se reconnecter
                </Button>
            </div>
        </div>
    );
}