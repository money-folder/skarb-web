import { WhistoryComposed } from "@/types/wallets-history";

interface Props {
  walletHistory: WhistoryComposed[];
}

export default async function CurrencyComposedTable({ walletHistory }: Props) {
  return (
    <div className="w-full h-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              Money Amount
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">
              Wallets
            </th>
            <th className="p-1 w-2/12 text-sm border-2 border-black">Date</th>
          </tr>
        </thead>
        <tbody>
          {[...walletHistory].reverse().map((wh) => (
            <tr key={wh.date.valueOf()}>
              <td className="p-1 w-2/12 text-sm text-center border-2 border-black">
                {wh.moneyAmount}
                <br />
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
