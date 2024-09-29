import { ClientWhistoryDto } from '@/types/wallets-history';

import Changes from '../../../components/Changes';
import SoftDeleteButton from '../buttons/SoftDeleteButton';
import RestoreButton from '../buttons/RestoreButton';
import DestroyButton from '../buttons/DestroyButton';
import DuplicateButton from '../buttons/DuplicateButton';
import { Dictionary } from '@/types/locale';

interface Props {
  d: Dictionary['whistoryPage']['whistoryTable'];
  walletHistory: ClientWhistoryDto[];
}

export default function WalletHistoryTable({ d, walletHistory }: Props) {
  return (
    <div className="h-full w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-2/12 border-2 border-black p-1 text-sm">{d.balance}</th>
            <th className="w-5/12 border-2 border-black p-1 text-sm">{d.date}</th>
            <th className="w-4/12 border-2 border-black p-1 text-sm">{d.changes}</th>
            <th className="w-1/12 border-2 border-black p-1 text-sm">{d.actions}</th>
          </tr>
        </thead>
        <tbody>
          {[...walletHistory].reverse().map((whistory) => (
            <tr key={whistory.id}>
              <td
                className={`border-2 border-black p-1 text-center text-sm ${
                  whistory.deletedAt ? 'opacity-30' : ''
                }`}
              >
                {whistory.moneyAmount}
              </td>
              <td
                className={`border-2 border-black p-1 text-center text-sm ${
                  whistory.deletedAt ? 'opacity-30' : ''
                }`}
              >
                {whistory.date.toLocaleString()}
              </td>
              <td
                className={`border-2 border-black p-1 text-center text-sm ${
                  whistory.deletedAt ? 'opacity-30' : ''
                }`}
              >
                <Changes
                  text={
                    whistory.changes
                      ? `${(whistory.changesAbs || 0).toFixed(2)} (${(
                          (whistory.changes || 0) * 100
                        ).toFixed(2)}%)`
                      : ''
                  }
                  isPositive={(whistory.changes || 0) > 0}
                />
              </td>
              <td className={`space-x-2 border-2 border-black p-1 text-center text-sm`}>
                {whistory.deletedAt ? (
                  <>
                    <RestoreButton id={whistory.id} />
                    <DestroyButton id={whistory.id} />
                  </>
                ) : (
                  <>
                    <DuplicateButton walletId={whistory.walletId} whistoryId={whistory.id} />
                    <SoftDeleteButton id={whistory.id} />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
