import { Suspense } from "react";

import { fetchCurrentUserWallets } from "@/actions/wallets";
import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import WalletsTable from "./components/WalletsTable";

export default async function Wallets() {
  const result = await fetchCurrentUserWallets();

  return (
    <main className="w-full">
      <h1 className="w-full text-center font-extrabold text-lg">Wallets</h1>

      <div className="mt-10 w-full flex flex-col items-center">
        <div className="w-2/3">
          <CreateWalletButton />
        </div>

        <div className="mt-5 w-2/3">
          <Suspense fallback={<div>Loading...</div>}>
            {result.data ? <WalletsTable wallets={result.data} /> : null}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
