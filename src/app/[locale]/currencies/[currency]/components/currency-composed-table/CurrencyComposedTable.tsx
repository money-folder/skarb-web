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
            <th className="p-1 w-2/12 text-sm border-2 border-black">Date</th>
          </tr>
        </thead>
        <tbody>
          {[...walletHistory].reverse().map((wh) => (
            <tr key={wh.date.valueOf()}>
              <td className="p-1 w-2/12 text-sm text-center border-2 border-black">
                {wh.moneyAmount}
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
