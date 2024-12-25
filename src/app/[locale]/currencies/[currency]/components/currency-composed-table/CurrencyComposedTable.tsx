import Changes from "@/app/[locale]/wallets/components/Changes";
import { Dictionary } from "@/shared/types/locale";
import { WhistoryComposed } from "@/types/wallets-history";

interface Props {
  walletHistory: WhistoryComposed[];
  d: Dictionary["currencyPage"]["currencyTable"];
}

export default async function CurrencyComposedTable({
  walletHistory,
  d,
}: Props) {
  return (
    <div className="w-full h-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.moneyAmount}
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.changes}
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.wallets}
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              {d.date}
            </th>
          </tr>
        </thead>
        <tbody>
          {[...walletHistory].reverse().map((wh) => (
            <tr key={wh.date.valueOf()}>
              <td className="p-1 w-2/12 text-sm text-center border-2 border-black">
                {wh.moneyAmount}
                <br />
              </td>
              <td className="p-1 w-2/12 text-sm text-center border-2 border-black">
                <Changes
                  text={
                    wh.changes
                      ? `${(wh.changesAbs || 0).toFixed(2)} (${(
                          (wh.changes || 0) * 100
                        ).toFixed(2)}%)`
                      : ""
                  }
                  isPositive={(wh.changes || 0) > 0}
                />
              </td>
              <td className="p-1 w-2/12 text-xs border-2 border-black">
                <ul className="pl-5 list-disc">
                  {wh.whistories.map((wh2) => (
                    <li
                      key={wh2.id}
                    >{`${wh2.wallet.name} (${wh2.moneyAmount})`}</li>
                  ))}
                </ul>
              </td>
              <td className="p-1 w-2/12 text-sm text-center border-2 border-black">
                {wh.date.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
