import SkeletonBar from "@/components/SkeletonBar";

export default async function WalletHistoryTitleLoading() {
  return (
    <h1 className="h-[28px] col-span-3 row-span-1 flex justify-center">
      <div className="w-2/12">
        <SkeletonBar />
      </div>
    </h1>
  );
}
