import LoadingRow from "./LoadingRow";

export default function Loading() {
  return (
    <div className="w-full h-full grid gap-5  grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr]">
      <div className="w-full col-span-2 row-span-1 flex">
        <div className="h-[90px] w-[140px] bg-gray-300 border-b-2 border-b-black animate-pulse"></div>
      </div>

      <div className="w-full max-w-[550px] col-span-2 row-span-1">
        <table className="w-full border-collapse animate-pulse">
          <thead>
            <tr>
              <th className="p-1 w-2/12 text-sm border-2 border-black">
                Amount
              </th>
              <th className="p-1 w-5/12 text-sm border-2 border-black">Date</th>
              <th className="p-1 w-4/12 text-sm border-2 border-black">
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
    </div>
  );
}
