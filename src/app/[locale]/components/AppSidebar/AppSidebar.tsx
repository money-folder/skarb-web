import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

import { fetchCurrentUserCurrencies } from "@/app/[locale]/currencies/[currency]/history/actions";
import CreateWhistoryButton from "@/app/[locale]/wallets/[id]/components/whistory-create/CreateWhistoryButton";
import { fetchCurrentUserWallets } from "@/app/[locale]/wallets/actions";
import CreateWalletButton from "@/app/[locale]/wallets/components/create-wallet/CreateWalletButton";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { AppSidebarNav } from "./AppSidebarNav";

import LogoIcon from "../../logo.svg";

interface AppSidebarProps {
  locale: Locale;
}

export const AppSidebar = async ({ locale }: AppSidebarProps) => {
  const d = await getDictionary(locale, "appSidebar");
  const dNav = await getDictionary(locale, "sidebar");
  const dCurrency = await getDictionary(locale, "currencyPage");

  const [walletsResponse, currenciesResponse] = await Promise.all([
    fetchCurrentUserWallets(),
    fetchCurrentUserCurrencies(),
  ]);

  const wallets = walletsResponse.data || [];
  const currencies = currenciesResponse.data || [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2">
        <Link href={`/${locale}`} className="rounded-lg bg-black p-2">
          <Image
            src={LogoIcon}
            alt="Skarb icon"
            width={38}
            height={38}
            className="rounded"
          />
        </Link>
        <h2 className="text-lg font-bold group-data-[collapsible=icon]:hidden">
          {d.appTitle}
        </h2>
      </SidebarHeader>
      <SidebarContent className="mt-10 overflow-x-hidden">
        <AppSidebarNav
          locale={locale}
          wallets={wallets}
          currencies={currencies}
          dictionary={{
            walletsTitle: dNav.walletsTitle,
            currenciesTitle: dNav.currenciesTitle,
            history: dCurrency.navbar.history,
            expenses: dCurrency.navbar.expenses,
            earnings: dCurrency.navbar.earnings,
          }}
          CreateWalletButton={CreateWalletButton}
          CreateWhistoryButton={CreateWhistoryButton}
        />
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
};
