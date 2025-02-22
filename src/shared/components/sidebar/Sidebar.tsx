import { fetchCurrentUserCurrencies } from "@/app/[locale]/currencies/actions";
import CreateWhistoryButton from "@/app/[locale]/wallets/[id]/components/whistory-create/CreateWhistoryButton";
import { fetchCurrentUserWallets } from "@/app/[locale]/wallets/actions";
import CreateWalletButton from "@/app/[locale]/wallets/components/create-wallet/CreateWalletButton";
import { auth } from "@/auth";
import { getDictionary } from "@/dictionaries";
import { getServerLocale } from "@/getServerLocale";
import { DEFAULT_LOCALE } from "@/locale";

import { SignOut } from "../SignOut";
import NavLink from "./Navlink";
import UserProfile from "./UserProfile";

export default async function Sidebar() {
  const session = await auth();

  const locale = getServerLocale();
  const d = await getDictionary(locale);

  const [walletsResponse, currenciesResponse] = await Promise.all([
    fetchCurrentUserWallets(),
    fetchCurrentUserCurrencies(),
  ]);

  return (
    <div className="flex h-full w-[225px] flex-col border-r-2 border-r-black p-5">
      <UserProfile />

      <ul className="mt-5 flex-grow">
        {walletsResponse.data ? (
          <>
            <li className="flex w-full justify-between gap-2 overflow-hidden truncate">
              <NavLink
                activeClassName="text-white bg-black"
                href={`${
                  locale !== DEFAULT_LOCALE ? `/${locale}` : ""
                }/wallets`}
              >
                {d.sidebar.walletsTitle}
              </NavLink>

              <span className="w-fit shrink-0">
                <CreateWalletButton />
              </span>
            </li>

            <ul className="pl-5">
              {walletsResponse.data.map((w) => (
                <li
                  key={w.id}
                  className="flex w-full justify-between gap-2 overflow-hidden truncate"
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
            <li>{d.sidebar.currenciesTitle}</li>

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
        {session?.user ? <SignOut text={d.sidebar.signoutLabel} /> : null}
      </div>
    </div>
  );
}
