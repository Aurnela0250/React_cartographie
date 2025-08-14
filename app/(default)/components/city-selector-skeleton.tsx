import { Label } from "@/presentation/components/ui/label";
import { Skeleton } from "@/presentation/components/ui/skeleton";

/**
 * Composant skeleton pour le CitySelector
 * Utilisé comme fallback dans les Suspense boundaries
 */
export function CitySelectorSkeleton() {
    return (
        <div className="space-y-2">
            <Label htmlFor="city-selector-skeleton">Villes</Label>
            <div className="relative">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}