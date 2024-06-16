import { getWalletHistory } from "@/services/wallets-history";
import WalletHistoryTable from "./WalletHistoryTable";

interface Props {
  params: { id: string };
}

export default async function WalletHistory({ params: { id } }: Props) {
  const walletHistory = await getWalletHistory(id);

  return (
    <main className="w-full h-full grid grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5 overflow-hidden">
      <h1 className="w-full col-span-3 row-span-1 text-center font-extrabold text-lg">
        Wallet History
      </h1>

      <div className="h-full row-span-1 col-span-2 flex gap-5 overflow-hidden">
        <div className="w-full h-full max-w-[400px] overflow-auto">
          <WalletHistoryTable walletHistory={walletHistory} />
        </div>

        <div className="w-full h-full">The Chart</div>
      </div>
    </main>
  );
}
