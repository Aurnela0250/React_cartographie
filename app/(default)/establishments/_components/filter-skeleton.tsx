import { Skeleton } from "@/presentation/components/ui/skeleton";

interface FilterSkeletonProps {
  lines?: number;
}

export function FilterSkeleton({ lines = 6 }: FilterSkeletonProps) {
  return (
    <div className="px-3 py-1 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  );
}
