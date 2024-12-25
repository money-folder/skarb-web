import { ClientWhistoryDto } from "@/app/[locale]/wallets/[id]/types";

import { Dictionary } from "@/shared/types/locale";
import Changes from "../../../components/Changes";
import DestroyButton from "../buttons/DestroyButton";
import DuplicateButton from "../buttons/DuplicateButton";
import RestoreButton from "../buttons/RestoreButton";
import SoftDeleteButton from "../buttons/SoftDeleteButton";

interface Props {
  d: Dictionary["whistoryPage"]["whistoryTable"];
  walletHistory: ClientWhistoryDto[];
}

export default function WalletHistoryTable({ d, walletHistory }: Props) {
  return (
    <div className="h-full w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-1 w-2/12 text-xs border-2 border-black">
              {d.balance}
            </th>
            <th className="p-1 w-2/12 text-xs border-2 border-black">
              {d.date}
            </th>
            <th className="p-1 w-4/12 text-xs border-2 border-black">
              {d.changes}
            </th>
            <th className="p-1 w-3/12 text-xs border-2 border-black">
              {d.comment}
            </th>
            <th className="p-1 w-1/12 text-xs border-2 border-black">
              {d.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {[...walletHistory].reverse().map((whistory) => (
            <tr key={whistory.id}>
              <td
                className={`p-1 text-xs text-center border-2 border-black ${
                  whistory.deletedAt ? "opacity-30" : ""
                }`}
              >
                {whistory.moneyAmount}
              </td>
              <td
                className={`p-1 text-xs text-center border-2 border-black ${
                  whistory.deletedAt ? "opacity-30" : ""
                }`}
              >
                {whistory.date.toLocaleString().split(", ")[0]}
              </td>
              <td
                className={`p-1 text-xs text-center border-2 border-black ${
                  whistory.deletedAt ? "opacity-30" : ""
                }`}
              >
                <Changes
                  text={
                    whistory.changes
                      ? `${(whistory.changesAbs || 0).toFixed(2)} (${(
                          (whistory.changes || 0) * 100
                        ).toFixed(2)}%)`
                      : ""
                  }
                  isPositive={(whistory.changes || 0) > 0}
                />
              </td>
              <td
                className={`p-1 space-x-2 text-xs text-center border-2 border-black`}
              >
                {whistory.comment || `-`}
              </td>
              <td
                className={`p-1 space-x-2 text-xs text-center border-2 border-black`}
              >
                {whistory.deletedAt ? (
                  <>
                    <RestoreButton id={whistory.id} />
                    <DestroyButton id={whistory.id} />
                  </>
                ) : (
                  <>
                    <DuplicateButton
                      walletId={whistory.walletId}
                      whistoryId={whistory.id}
                    />
                    <SoftDeleteButton id={whistory.id} />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
