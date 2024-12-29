import { Dictionary } from "@/shared/types/locale";
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
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.name}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.balance}
            </th>
            <th className="w-1/12 border-2 border-black p-1 text-sm">
              {d.currency}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.changes}
            </th>
            <th className="w-3/12 border-2 border-black p-1 text-sm">
              {d.sinceLastReport}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
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
