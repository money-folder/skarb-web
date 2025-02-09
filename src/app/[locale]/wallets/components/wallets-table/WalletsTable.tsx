import Image from "next/image";
import Link from "next/link";

import { Dictionary } from "@/dictionaries/locale";
import { Locale } from "@/locale";
import { formatDateDifference } from "@/shared/utils/time-utils";

import DuplicateButton from "../../[id]/components/buttons/DuplicateButton";
import { ClientWalletDto } from "../../types";
import Changes from "../Changes";
import AddWhistoryButton from "../buttons/AddWhistoryButton";
import DestroyButton from "../buttons/DestroyButton";
import RestoreButton from "../buttons/RestoreButton";
import SoftDeleteButton from "../buttons/SoftDeleteButton";

import OpenIcon from "@/assets/open.svg";

interface WalletsTableProps {
  locale: Locale;
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
          <th className="w-2/12 border-2 border-black p-1 text-sm">{d.name}</th>
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
        {wallets.map((wallet) => (
          <tr key={wallet.id}>
            <td
              className={`border-2 border-black p-1 text-center text-sm ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              {wallet.name}
            </td>
            <td
              className={`border-2 border-black p-1 text-center text-sm ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              {wallet?.latestWhistory?.moneyAmount || "-"}
            </td>
            <td
              className={`border-2 border-black p-1 text-center text-sm ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              <Link
                href={`/currencies/${wallet.currency}`}
                className="hover:underline"
              >
                {wallet.currency}
              </Link>
            </td>
            <td
              className={`border-2 border-black p-1 text-center text-sm ${
                wallet.deletedAt ? "opacity-30" : ""
              }`}
            >
              <Changes
                text={
                  wallet.changes
                    ? `${(wallet.changesAbs || 0).toFixed(2)} (${(
                        (wallet.changes || 0) * 100
                      ).toFixed(2)}%)`
                    : ""
                }
                isPositive={(wallet.changes || 0) >= 0}
              />
            </td>
            <td
              className={`border-2 border-black p-1 text-center text-sm ${
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
                    locale,
                  )
                : "-"}
            </td>
            <td className="space-x-2 border-2 border-black p-1 text-center text-sm">
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
