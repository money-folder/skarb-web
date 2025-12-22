import { Skeleton } from "@/components/ui/skeleton";

export default function WhistoryTableLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Filters skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="flex gap-4 border-b bg-muted/50 p-4">
          <Skeleton className="h-4 w-3/12" />
          <Skeleton className="h-4 w-2/12" />
          <Skeleton className="h-4 w-3/12" />
          <Skeleton className="h-4 w-2/12" />
          <Skeleton className="h-4 w-2/12" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b p-4 last:border-0">
            <Skeleton className="h-4 w-3/12" />
            <Skeleton className="h-4 w-2/12" />
            <Skeleton className="h-4 w-3/12" />
            <Skeleton className="h-4 w-2/12" />
            <Skeleton className="h-4 w-2/12" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex w-full items-center justify-center">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
