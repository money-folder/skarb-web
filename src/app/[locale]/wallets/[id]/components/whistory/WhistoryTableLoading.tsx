import { Skeleton } from "@/components/ui/skeleton";

export default function WhistoryTableLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Filters skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="flex border-b bg-muted/50 p-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="ml-auto h-4 w-[80px]" />
          <Skeleton className="ml-4 h-4 w-[100px]" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex border-b p-4 last:border-0">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="ml-auto h-4 w-[80px]" />
            <Skeleton className="ml-4 h-4 w-[100px]" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[140px]" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
