import { Dictionary } from "@/types/locale";
import LoadingRow from "./LoadingRow";

interface Props {
  d: Dictionary["whistoryPage"]["whistoryTable"];
}

export default function Loading({ d }: Props) {
  return (
    <div className="w-full h-full grid gap-5  grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr]">
      <div className="w-full col-span-2 row-span-1 flex gap-5">
        <div className="h-[90px] w-[180px] bg-gray-300 border-b-2 border-b-black animate-pulse"></div>
        <div className="h-[90px] w-[180px] bg-gray-300 border-b-2 border-b-black animate-pulse"></div>
      </div>

      <div className="w-full max-w-[550px] col-span-2 row-span-1">
        <table className="w-full border-collapse animate-pulse">
          <thead>
            <tr>
              <th className="p-1 w-2/12 text-sm border-2 border-black">
                {d.balance}
              </th>
              <th className="p-1 w-5/12 text-sm border-2 border-black">
                {d.date}
              </th>
              <th className="p-1 w-4/12 text-sm border-2 border-black">
                {d.changes}
              </th>
              <th className="p-1 w-1/12 text-sm border-2 border-black">
                {d.actions}
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
