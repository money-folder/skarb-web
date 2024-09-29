import Changes from '@/app/[locale]/wallets/components/Changes';
import { WhistoryComposed } from '@/types/wallets-history';

interface Props {
  walletHistory: WhistoryComposed[];
}

export default async function CurrencyComposedTable({ walletHistory }: Props) {
  return (
    <div className="h-full w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Money Amount</th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Changes</th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Wallets</th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Date</th>
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
                    wh.changes
                      ? `${(wh.changesAbs || 0).toFixed(2)} (${((wh.changes || 0) * 100).toFixed(
                          2,
                        )}%)`
                      : ''
                  }
                  isPositive={(wh.changes || 0) > 0}
                />
              </td>
              <td className="w-2/12 border-2 border-black p-1 text-xs">
                <ul className="list-disc pl-5">
                  {wh.whistories.map((wh2) => (
                    <li key={wh2.id}>{`${wh2.wallet.name} (${wh2.moneyAmount})`}</li>
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
