import { Skeleton } from "@/components/ui/skeleton";

export default function WhistoryChartLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Chart controls skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-[36px] w-[140px]" />
      </div>

      {/* Chart area skeleton */}
      <div className="flex-1">
        <Skeleton className="h-[20vw] w-full" />
      </div>
    </div>
  );
}
