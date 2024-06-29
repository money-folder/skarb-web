import Image from "next/image";
import Link from "next/link";

import { ClientWalletDto } from "@/types/wallets";

import Changes from "../Changes";
import AddWhistoryButton from "../buttons/AddWhistoryButton";
import SoftDeleteButton from "../buttons/SoftDeleteButton";
import RestoreButton from "../buttons/RestoreButton";
import DestroyButton from "../buttons/DestroyButton";

import OpenIcon from "@/assets/open.svg";

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
          <th className="p-1 text-sm border-2 border-black">Changes</th>
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
              <Changes percents={+((wallet.changes || 0) * 100).toFixed(3)} />
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
                  <RestoreButton id={wallet.id} />
                  <DestroyButton id={wallet.id} />
                </>
              ) : (
                <SoftDeleteButton id={wallet.id} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
