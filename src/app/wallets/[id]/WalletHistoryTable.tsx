import Image from "next/image";

import { ClientWHistoryDto } from "@/types/wallets-history";

import CrossIcon from "@/assets/cross.svg";
import RestoreIcon from "@/assets/restore.svg";
import TrashIcon from "@/assets/trash.svg";

interface Props {
  walletHistory: ClientWHistoryDto[];
}

export default function WalletHistoryTable({ walletHistory }: Props) {
  return (
    <div className="h-full w-full overflow-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-1 text-sm border-2 border-black">Amount</th>
            <th className="p-1 text-sm border-2 border-black">Date</th>
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
                className={`p-1 space-x-2 text-sm text-center border-2 border-black`}
              >
                {whistory.deletedAt ? (
                  <>
                    <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                      <Image src={RestoreIcon} alt="restore" />
                    </button>

                    <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                      <Image src={TrashIcon} alt="restore" />
                    </button>
                  </>
                ) : (
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={CrossIcon} alt="cross" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
