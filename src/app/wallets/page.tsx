import { Suspense } from "react";

import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import WalletsTableContainer from "./components/wallets-table/WalletsTableContainer";
import WalletsTableLoading from "./components/wallets-table/WalletsTableLoading";

export default async function Wallets() {
  return (
    <main className="w-full">
      <h1 className="w-full text-center font-extrabold text-lg">Wallets</h1>

      <div className="mt-10 w-full flex flex-col items-center">
        <div className="w-2/3">
          <CreateWalletButton />
        </div>

        <div className="mt-5 w-2/3">
          <Suspense fallback={<WalletsTableLoading />}>
            <WalletsTableContainer />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
