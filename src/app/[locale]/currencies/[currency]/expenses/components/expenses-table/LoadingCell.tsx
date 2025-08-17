import SkeletonBar from "@/shared/components/SkeletonBar";

export default function LoadingCell() {
  return (
    <div className="h-4 w-full">
      <SkeletonBar />
    </div>
  );
}
