import { ClientWalletDto } from "@/types/wallets";

interface WalletsTableProps {
  wallets: ClientWalletDto[];
}

export function WalletsTable({ wallets }: WalletsTableProps) {
  return (
    <table className="mt-5 w-2/3">
      <thead>
        <tr>
          <th className="p-1 text-sm border-2 border-black">Name</th>
          <th className="p-1 text-sm border-2 border-black">Latest Balance</th>
          <th className="p-1 text-sm border-2 border-black">Currency</th>
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
              {wallet.latestBalanceTs || "-"}
            </td>
            <td className="p-1 space-x-2 text-sm text-center border-2 border-black">
              IN PROGRESS
              {/* <Link to={`/wallets/${wallet.id}`}>
                <button className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100">
                  <img src={OpenIcon} alt="open" />
                </button>
              </Link>

              <AddWhistoryButton walletId={`${wallet.id}`} />

              {wallet.deletedAt ? (
                <>
                  <button
                    className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => onRestoreClick(`${wallet.id}`)}
                  >
                    <img src={RestoreIcon} alt="restore" />
                  </button>
                  <button
                    className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => onHardDeleteClick(`${wallet.id}`)}
                  >
                    <img src={TrashIcon} alt="restore" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => onDeleteClick(`${wallet.id}`)}
                  >
                    <img src={CrossIcon} alt="cross" />
                  </button>
                </>
              )} */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
