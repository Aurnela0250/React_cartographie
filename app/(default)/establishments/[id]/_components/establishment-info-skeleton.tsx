export function EstablishmentInfoSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
                <div className="flex gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="border rounded-lg p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="border rounded-lg p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border rounded-lg p-4 space-y-2">
                                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
