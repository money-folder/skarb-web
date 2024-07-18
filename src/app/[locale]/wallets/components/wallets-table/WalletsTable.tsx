import Image from "next/image";
import Link from "next/link";

import { ClientWalletDto } from "@/types/wallets";
import { formatDateDifference } from "@/utils/time-utils";

import Changes from "../Changes";
import AddWhistoryButton from "../buttons/AddWhistoryButton";
import SoftDeleteButton from "../buttons/SoftDeleteButton";
import RestoreButton from "../buttons/RestoreButton";
import DestroyButton from "../buttons/DestroyButton";
import DuplicateButton from "../../[id]/components/buttons/DuplicateButton";

import OpenIcon from "@/assets/open.svg";
import { Dictionary } from "@/types/locale";

interface WalletsTableProps {
  locale: string;
  d: Dictionary["walletsPage"]["walletsTable"];
  wallets: ClientWalletDto[];
}

export default function WalletsTable({
  locale,
  d,
  wallets,
}: WalletsTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="p-1 w-2/12 text-sm border-2 border-black">{d.name}</th>
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
              {wallet?.latestWhistory?.moneyAmount || "-"}
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
              {wallet.sinceLatestBallanceTs
                ? formatDateDifference(
                    {
                      days: wallet.sinceLatestBallanceTs.days,
                      hours: wallet.sinceLatestBallanceTs.hours,
                      minutes: wallet.sinceLatestBallanceTs.minutes,
                    },
                    locale
                  )
                : "-"}
            </td>
            <td className="p-1 space-x-2 text-sm text-center border-2 border-black">
              <AddWhistoryButton
                walletId={wallet.id}
                walletName={wallet.name}
              />

              {wallet.latestWhistory && !wallet.deletedAt ? (
                <DuplicateButton
                  walletId={wallet.id}
                  whistoryId={wallet.latestWhistory?.id}
                />
              ) : null}

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
