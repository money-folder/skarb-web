"use client";

import { TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DEFAULT_LOCALE, Locale } from "@/locale";
import { getMonthStartTs } from "@/shared/utils/time-utils";

interface Wallet {
  id: string;
  name: string;
}

interface AppSidebarNavProps {
  locale: Locale;
  wallets: Wallet[];
  currencies: string[];
  dictionary: {
    walletsTitle: string;
    currenciesTitle: string;
    history: string;
    expenses: string;
    earnings: string;
  };
  CreateWalletButton: React.ComponentType;
  CreateWhistoryButton: React.ComponentType<{
    walletId: string;
    walletName: string;
  }>;
}

export const AppSidebarNav = ({
  locale,
  wallets,
  currencies,
  dictionary,
  CreateWalletButton,
  CreateWhistoryButton,
}: AppSidebarNavProps) => {
  const pathname = usePathname();

  const getHref = (path: string) => {
    return locale !== DEFAULT_LOCALE ? `/${locale}${path}` : path;
  };

  const isActive = (href: string, isNested = false) => {
    return isNested ? pathname.includes(href) : pathname === href;
  };

  return (
    <>
      {/* Wallets Section */}
      {wallets.length > 0 && (
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Link
                href={getHref("/wallets")}
                className="flex items-center gap-2 hover:underline"
              >
                <Wallet className="h-4 w-4" />
                {dictionary.walletsTitle}
              </Link>
            </SidebarGroupLabel>
            <div className="group-data-[collapsible=icon]:hidden">
              <CreateWalletButton />
            </div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {wallets.map((wallet) => (
                <SidebarMenuItem key={wallet.id}>
                  <div className="flex items-center justify-between gap-2">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(
                        getHref(`/wallets/${wallet.id}`),
                        true,
                      )}
                      tooltip={wallet.name}
                      className="flex-1"
                    >
                      <Link href={getHref(`/wallets/${wallet.id}`)}>
                        <Wallet className="h-4 w-4" />
                        <span className="truncate">{wallet.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <span className="shrink-0 group-data-[collapsible=icon]:hidden">
                      <CreateWhistoryButton
                        walletId={wallet.id}
                        walletName={wallet.name}
                      />
                    </span>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Currencies Section */}
      {currencies.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {dictionary.currenciesTitle}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currencies.map((currency) => (
                <SidebarMenuItem key={currency}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(
                      getHref(`/currencies/${currency}`),
                      true,
                    )}
                    tooltip={currency}
                  >
                    <Link href={getHref(`/currencies/${currency}`)}>
                      <TrendingUp className="h-4 w-4" />
                      <span className="truncate">{currency}</span>
                    </Link>
                  </SidebarMenuButton>
                  {/* Nested sub-items */}
                  <SidebarMenu className="ml-4 mt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={isActive(
                          getHref(`/currencies/${currency}/history`),
                          true,
                        )}
                      >
                        <Link
                          href={getHref(
                            `/currencies/${currency}/history?dayStep=30`,
                          )}
                        >
                          <span className="truncate">{dictionary.history}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={isActive(
                          getHref(`/currencies/${currency}/expenses`),
                          true,
                        )}
                      >
                        <Link
                          href={getHref(
                            `/currencies/${currency}/expenses?fromTs=${getMonthStartTs(new Date())}`,
                          )}
                        >
                          <span className="truncate">
                            {dictionary.expenses}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        size="sm"
                        isActive={isActive(
                          getHref(`/currencies/${currency}/earnings`),
                          true,
                        )}
                      >
                        <Link
                          href={getHref(
                            `/currencies/${currency}/earnings?fromTs=${getMonthStartTs(new Date())}`,
                          )}
                        >
                          <span className="truncate">
                            {dictionary.earnings}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
};
