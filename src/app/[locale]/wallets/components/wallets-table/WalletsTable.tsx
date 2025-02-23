import Link from "next/link";

import { getDictionary } from "@/dictionaries";
import { formatDateDifference } from "@/shared/utils/time-utils";

import { Locale } from "@/locale";
import DuplicateButton from "../../[id]/components/buttons/DuplicateButton";
import { ClientWalletDto } from "../../types";
import Changes from "../Changes";
import AddWhistoryButton from "../buttons/AddWhistoryButton";
import DestroyButton from "../buttons/DestroyButton";
import RestoreButton from "../buttons/RestoreButton";
import SoftDeleteButton from "../buttons/SoftDeleteButton";
import { EditButton } from "../edit-wallet/EditWalletButton";

interface WalletsTableProps {
  locale: Locale;
  wallets: ClientWalletDto[];
}

export default async function WalletsTable({
  locale,
  wallets,
}: WalletsTableProps) {
  const d = await getDictionary(locale, "walletsPage.walletsTable");

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
              <Link href={`/wallets/${wallet.id}`} className="hover:underline">
                {wallet.name}
              </Link>
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
                  // @TODO: move to a util, lol
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

              <EditButton wallet={wallet} />

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
