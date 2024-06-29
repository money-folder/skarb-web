import { ClientWhistoryDto } from "@/types/wallets-history";

import Changes from "../components/Changes";
import SoftDeleteButton from "./components/SoftDeleteButton";
import RestoreButton from "./components/RestoreButton";
import DestroyButton from "./components/DestroyButton";

interface Props {
  walletHistory: ClientWhistoryDto[];
}

export default function WalletHistoryTable({ walletHistory }: Props) {
  return (
    <div className="h-full w-full overflow-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-1 text-sm border-2 border-black">Amount</th>
            <th className="p-1 text-sm border-2 border-black">Date</th>
            <th className="p-1 text-sm border-2 border-black">Changes</th>
            <th className="p-1 text-sm border-2 border-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {walletHistory.map((whistory) => (
            <tr key={whistory.id}>
              <td
                className={`p-1 text-sm text-center border-2 border-black ${
                  whistory.deletedAt ? "opacity-30" : ""
                }`}
              >
                {whistory.moneyAmount}
              </td>
              <td
                className={`p-1 text-sm text-center border-2 border-black ${
                  whistory.deletedAt ? "opacity-30" : ""
                }`}
              >
                {whistory.date.toLocaleString()}
              </td>
              <td
                className={`p-1 text-sm text-center border-2 border-black ${
                  whistory.deletedAt ? "opacity-30" : ""
                }`}
              >
                <Changes
                  percents={+((whistory.changes || 0) * 100).toFixed(2)}
                />
              </td>
              <td
                className={`p-1 space-x-2 text-sm text-center border-2 border-black`}
              >
                {whistory.deletedAt ? (
                  <>
                    <RestoreButton id={whistory.id} />
                    <DestroyButton id={whistory.id} />
                  </>
                ) : (
                  <SoftDeleteButton id={whistory.id} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
