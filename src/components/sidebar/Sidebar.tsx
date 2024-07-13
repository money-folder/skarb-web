import { fetchCurrentUserWallets } from "@/actions/wallets";
import CreateWhistoryButton from "@/widgets/create-whistory/CreateWhistoryButton";
import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import NavLink from "./Navlink";
import UserProfile from "./UserProfile";
import { SignOut } from "../SignOut";

export default async function Sidebar() {
  const result = await fetchCurrentUserWallets();

  return (
    <div className="p-5 w-[225px] h-full flex flex-col border-r-2 border-r-black">
      <UserProfile />

      <ul className="mt-5 flex-grow">
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

      <div className="mt-5 flex justify-center">
        <SignOut />
      </div>
    </div>
  );
}
