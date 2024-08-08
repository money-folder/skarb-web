import { auth } from "@/auth";
import { fetchCurrentUserWallets } from "@/actions/wallets";
import CreateWhistoryButton from "@/widgets/create-whistory/CreateWhistoryButton";
import CreateWalletButton from "@/widgets/create-wallet/CreateWalletButton";

import NavLink from "./Navlink";
import UserProfile from "./UserProfile";
import { SignOut } from "../SignOut";
import { Dictionary } from "@/types/locale";
import { DEFAULT_LOCALE } from "@/locales";
import { fetchCurrentUserCurrencies } from "@/actions/currencies";

interface Props {
  locale: string;
  d: Dictionary["sidebar"];
}

export default async function Sidebar({ d, locale }: Props) {
  const session = await auth();

  const [walletsResponse, currenciesResponse] = await Promise.all([
    fetchCurrentUserWallets(),
    fetchCurrentUserCurrencies(),
  ]);

  return (
    <div className="p-5 w-[225px] h-full flex flex-col border-r-2 border-r-black">
      <UserProfile d={d} />

      <ul className="mt-5 flex-grow">
        {walletsResponse.data ? (
          <>
            <li className="w-full flex justify-between gap-2 overflow-hidden truncate">
              <NavLink
                activeClassName="text-white bg-black"
                href={`${
                  locale !== DEFAULT_LOCALE ? `/${locale}` : ""
                }/wallets`}
              >
                {d.walletsTitle}
              </NavLink>

              <span className="w-fit shrink-0">
                <CreateWalletButton />
              </span>
            </li>

            <ul className="pl-5">
              {walletsResponse.data.map((w) => (
                <li
                  key={w.id}
                  className="w-full flex justify-between gap-2 overflow-hidden truncate"
                >
                  <NavLink
                    className="overflow-hidden text-ellipsis"
                    activeClassName="text-white bg-black"
                    href={`${
                      locale !== DEFAULT_LOCALE ? `/${locale}` : ""
                    }/wallets/${w.id}`}
                  >
                    {w.name}
                  </NavLink>

                  <span className="w-fit shrink-0">
                    <CreateWhistoryButton walletId={w.id} walletName={w.name} />
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {currenciesResponse.data ? (
          <>
            <li>Currencies</li>

            <ul className="pl-5">
              {currenciesResponse.data.map((c) => (
                <li key={c}>
                  <NavLink
                    className="overflow-hidden text-ellipsis"
                    activeClassName="text-white bg-black"
                    href={`${
                      locale !== DEFAULT_LOCALE ? `/${locale}` : ""
                    }/currencies/${c}`}
                  >
                    {c}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </ul>

      <div className="mt-5 flex justify-center">
        {session?.user ? <SignOut text={d.signoutLabel} /> : null}
      </div>
    </div>
  );
}
