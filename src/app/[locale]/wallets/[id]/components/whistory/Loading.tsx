import { Dictionary } from "@/shared/types/locale";
import LoadingRow from "./LoadingRow";

interface Props {
  d: Dictionary["whistoryPage"]["whistoryTable"];
}

export default function Loading({ d }: Props) {
  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex w-full gap-5">
        <div className="h-[90px] w-[180px] animate-pulse border-b-2 border-b-black bg-gray-300"></div>
        <div className="h-[90px] w-[180px] animate-pulse border-b-2 border-b-black bg-gray-300"></div>
      </div>

      <div className="col-span-2 row-span-1 w-full max-w-[550px]">
        <table className="w-full border-collapse animate-pulse">
          <thead>
            <tr>
              <th className="w-2/12 border-2 border-black p-1 text-sm">
                {d.balance}
              </th>
              <th className="w-5/12 border-2 border-black p-1 text-sm">
                {d.date}
              </th>
              <th className="w-4/12 border-2 border-black p-1 text-sm">
                {d.changes}
              </th>
              <th className="w-1/12 border-2 border-black p-1 text-sm">
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
