import SkeletonBar from "@/components/SkeletonBar";
import LoadingRow from "./LoadingRow";

export default function Loading() {
  return (
    <>
      <div className="w-full h-full max-w-[450px]">
        <div className="h-[25px] w-[75px] animate-pulse">
          <SkeletonBar />
        </div>

        <table className="mt-5 w-full border-collapse animate-pulse">
          <thead>
            <tr>
              <th className="p-1 w-3/12 text-sm border-2 border-black">
                Amount
              </th>
              <th className="p-1 w-5/12 text-sm border-2 border-black">Date</th>
              <th className="p-1 w-3/12 text-sm border-2 border-black">
                Changes
              </th>
              <th className="p-1 w-1/12 text-sm border-2 border-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(16)].map((_, i) => (
              <LoadingRow key={i} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-full w-full"></div>
    </>
  );
}
