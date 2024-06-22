import Image from "next/image";
import Link from "next/link";

import { ClientWalletDto } from "@/types/wallets";

import AddWhistoryButton from "./buttons/AddWhistoryButton";

import CrossIcon from "@/assets/cross.svg";
import OpenIcon from "@/assets/open.svg";
import RestoreIcon from "@/assets/restore.svg";
import TrashIcon from "@/assets/trash.svg";

interface WalletsTableProps {
  wallets: ClientWalletDto[];
}

export default function WalletsTable({ wallets }: WalletsTableProps) {
  return (
    <table className="w-full">
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
              <AddWhistoryButton walletId={wallet.id} />

              <Link
                className="inline-block cursor-pointer opacity-70 hover:opacity-100"
                href={`/wallets/${wallet.id}`}
              >
                <Image src={OpenIcon} width={16} height={16} alt="open" />
              </Link>

              {wallet.deletedAt ? (
                <>
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={RestoreIcon} alt="restore" />
                  </button>
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={TrashIcon} width={16} height={16} alt="trash" />
                  </button>
                </>
              ) : (
                <>
                  <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                    <Image src={CrossIcon} width={16} height={16} alt="cross" />
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
