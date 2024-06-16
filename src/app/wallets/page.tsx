import { Suspense } from "react";

import { getCurrentUserWallets } from "@/services/wallets";
import { WalletsTable } from "./components/WalletsTable";

export default async function Wallets() {
  const wallets = await getCurrentUserWallets();

  return (
    <main>
      <h1 className="w-full text-center font-extrabold text-lg">Wallets</h1>

      <div className="w-full flex justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <WalletsTable wallets={wallets} />
        </Suspense>
      </div>
    </main>
  );
}
