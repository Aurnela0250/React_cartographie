import { Skeleton } from "@/presentation/components/ui/skeleton";

export function RegionListSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between rounded border p-2"
                >
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="size-8" />
                        <Skeleton className="size-8" />
                    </div>
                </div>
            ))}
        </div>
    );
}
