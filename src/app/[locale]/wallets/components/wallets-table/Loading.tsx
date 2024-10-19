import { Dictionary } from "@/types/locale";
import LoadingRow from "./LoadingRow";

interface Props {
  d: Dictionary["walletsPage"]["walletsTable"];
}

export default async function WalletsTableLoading({ d }: Props) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse animate-pulse">
        <thead>
          <tr>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.name}
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.balance}
            </th>
            <th className="p-1 w-1/12 text-sm border-2 border-black">
              {d.currency}
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.changes}
            </th>
            <th className="p-1 w-3/12 text-sm border-2 border-black">
              {d.sinceLastReport}
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.actions}
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
