import { Locale } from "@/locale";

interface Props {
  children: React.ReactNode;
  params: {
    locale: Locale;
    currency: string;
  };
}

export default async function CurrencyLayout({
  children,
  params: { currency },
}: Props) {
  return (
    <main className="flex h-full w-full flex-col">
      <h1 className="w-full text-center text-lg font-extrabold">{currency}</h1>
      {children}
    </main>
  );
}
