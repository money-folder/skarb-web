import { Suspense } from "react";

import { getCurrentUserWallets } from "@/services/wallets";
import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import WalletsTable from "./components/WalletsTable";

export default async function Wallets() {
  const wallets = await getCurrentUserWallets();

  return (
    <main>
      <h1 className="w-full text-center font-extrabold text-lg">Wallets</h1>

      <div className="mt-10 w-full flex flex-col items-center">
        <div className="w-2/3">
          <CreateWalletButton />
        </div>

        <div className="mt-5 w-2/3">
          <Suspense fallback={<div>Loading...</div>}>
            <WalletsTable wallets={wallets} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
