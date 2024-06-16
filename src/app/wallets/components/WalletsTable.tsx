import Image from "next/image";

import { ClientWalletDto } from "@/types/wallets";

import CrossIcon from "@/assets/cross.svg";
import OpenIcon from "@/assets/open.svg";
import RestoreIcon from "@/assets/restore.svg";
import TrashIcon from "@/assets/trash.svg";

interface WalletsTableProps {
  wallets: ClientWalletDto[];
}

export function WalletsTable({ wallets }: WalletsTableProps) {
  return (
    <table className="mt-5 w-2/3">
      <thead>
        <tr>
          <th className="p-1 text-sm border-2 border-black">Name</th>
          <th className="p-1 text-sm border-2 border-black">Latest Balance</th>
          <th className="p-1 text-sm border-2 border-black">Currency</th>
          <th className="p-1 text-sm border-2 border-black">Latest Report</th>
          <th className="p-1 text-sm border-2 border-black">Actions</th>
        </tr>
      </thead>
      <tbody>
        {wallets.map((wallet) => (
          <tr key={wallet.id}>
            <td
              className={`p-1 text-sm text-center border-2 border-black ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              {wallet.name}
            </td>
            <td
              className={`p-1 text-sm text-center border-2 border-black ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              {wallet.latestBalance || "-"}
            </td>
            <td
              className={`p-1 text-sm text-center border-2 border-black ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              {wallet.currency}
            </td>
            <td
              className={`p-1 text-sm text-center border-2 border-black ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              {wallet.latestBalanceTs || "-"}
            </td>
            <td className="p-1 space-x-2 text-sm text-center border-2 border-black">
              <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                <Image src={OpenIcon} alt="open" />
              </button>
              {wallet.deletedAt ? (
                <>
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={RestoreIcon} alt="restore" />
                  </button>
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={TrashIcon} alt="trash" />
                  </button>
                </>
              ) : (
                <>
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={CrossIcon} alt="cross" />
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
