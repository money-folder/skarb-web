import SkeletonBar from "@/shared/components/SkeletonBar";

export default async function WalletHistoryTitleLoading() {
  return (
    <h1 className="col-span-3 row-span-1 flex h-[28px] justify-center">
      <div className="w-2/12">
        <SkeletonBar />
      </div>
    </h1>
  );
}
