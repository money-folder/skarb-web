import { DEFAULT_LOCALE, Locale } from "@/locale";

import { getDictionary } from "@/dictionaries";
import Navbar from "./components/Navbar";
import { Tab } from "./types";

interface Props {
  children: React.ReactNode;
  params: {
    locale: Locale;
    currency: string;
  };
}

export default async function CurrencyLayout({
  children,
  params: { locale, currency },
}: Props) {
  const d = await getDictionary(locale);

  const tabs: Tab[] = [
    {
      title: d.currencyPage.navbar.history,
      link: `${locale !== DEFAULT_LOCALE ? `/${locale}` : ""}/currencies/${currency}/history`,
    },
    {
      title: d.currencyPage.navbar.expenses,
      link: `${locale !== DEFAULT_LOCALE ? `/${locale}` : ""}/currencies/${currency}/expenses`,
    },
  ];
  return (
    <main className="flex h-full w-full flex-col">
      <h1 className="w-full text-center text-lg font-extrabold">{currency}</h1>
      <Navbar tabs={tabs} />
      {children}
    </main>
  );
}
