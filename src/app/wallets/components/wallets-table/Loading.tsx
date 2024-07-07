import SkeletonBar from "@/components/SkeletonBar";
import LoadingRow from "./LoadingRow";

export default async function WalletsTableLoading() {
  return (
    <div className="w-full">
      <div className="h-[25px] w-[75px] animate-pulse">
        <SkeletonBar />
      </div>

      <table className="mt-5 w-full border-collapse animate-pulse">
        <thead>
          <tr>
            <th className="p-1 w-2/12 text-sm border-2 border-black">Name</th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              Latest Balance
            </th>
            <th className="p-1 w-1/12 text-sm border-2 border-black">
              Currency
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              Changes
            </th>
            <th className="p-1 w-3/12 text-sm border-2 border-black">
              Since Latest Report
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {[...Array(7)].map((_, i) => (
            <LoadingRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
