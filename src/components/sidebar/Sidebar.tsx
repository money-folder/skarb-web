import { fetchCurrentUserWallets } from "@/actions/wallets";
import CreateWhistoryButton from "@/widgets/create-whistory/CreateWhistoryButton";
import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import NavLink from "./Navlink";

export default async function Sidebar() {
  const result = await fetchCurrentUserWallets();

  return (
    <div className="w-[225px] h-full border-r-2 border-r-black">
      <ul className="p-5">
        <li className="w-full flex justify-between gap-2 overflow-hidden truncate">
          <NavLink activeClassName="text-white bg-black" href="/wallets">
            Wallets
          </NavLink>

          <span className="w-fit shrink-0">
            <CreateWalletButton />
          </span>
        </li>

        {result.data ? (
          <ul className="pl-5">
            {result.data.map((w) => (
              <li
                key={w.id}
                className="w-full flex justify-between gap-2 overflow-hidden truncate"
              >
                <NavLink
                  className="overflow-hidden text-ellipsis"
                  activeClassName="text-white bg-black"
                  href={`/wallets/${w.id}`}
                >
                  {w.name}
                </NavLink>

                <span className="w-fit shrink-0">
                  <CreateWhistoryButton walletId={w.id} walletName={w.name} />
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </ul>
    </div>
  );
}
