import { WhistoryComposed } from "@/app/[locale]/wallets/[id]/types";
import Changes from "@/app/[locale]/wallets/components/Changes";
import { getDictionary } from "@/dictionaries";
import { getServerLocale } from "@/getServerLocale";

interface Props {
  walletHistory: WhistoryComposed[];
}

export default async function CurrencyComposedTable({ walletHistory }: Props) {
  const locale = getServerLocale();
  const d = await getDictionary(locale, "currencyPage.currencyTable");

  return (
    <div className="h-full w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.moneyAmount}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.changes}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.wallets}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">
              {d.date}
            </th>
          </tr>
        </thead>
        <tbody>
          {[...walletHistory].reverse().map((wh) => (
            <tr key={wh.date.valueOf()}>
              <td className="w-2/12 border-2 border-black p-1 text-center text-sm">
                {wh.moneyAmount}
                <br />
              </td>
              <td className="w-2/12 border-2 border-black p-1 text-center text-sm">
                <Changes
                  text={
                    // @TODO: move it to a util, lol
                    wh.changes
                      ? `${(wh.changesAbs || 0).toFixed(2)} (${(
                          (wh.changes || 0) * 100
                        ).toFixed(2)}%)`
                      : ""
                  }
                  isPositive={(wh.changes || 0) > 0}
                />
              </td>
              <td className="w-2/12 border-2 border-black p-1 text-xs">
                <ul className="list-disc pl-5">
                  {wh.whistories.map((wh2) => (
                    <li
                      key={wh2.id}
                    >{`${wh2.wallet.name} (${wh2.moneyAmount})`}</li>
                  ))}
                </ul>
              </td>
              <td className="w-2/12 border-2 border-black p-1 text-center text-sm">
                {wh.date.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
