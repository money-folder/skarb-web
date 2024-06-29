import { Suspense } from "react";

import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import WalletsContainer from "./components/wallets-table/WalletsContainer";
import Loading from "./components/wallets-table/Loading";

export default function Wallets() {
  return (
    <main className="w-full">
      <h1 className="w-full text-center font-extrabold text-lg">Wallets</h1>

      <div className="mt-10 w-full flex flex-col items-center">
        <div className="w-2/3">
          <Suspense fallback={<Loading />}>
            <CreateWalletButton />

            <div className="mt-5">
              <WalletsContainer />
            </div>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
