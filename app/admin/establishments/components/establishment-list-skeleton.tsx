import { Skeleton } from "@/presentation/components/ui/skeleton";

export function EstablishmentListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center space-x-4 rounded-lg border p-4"
                >
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
