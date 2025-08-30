import { DEFAULT_LOCALE, Locale } from "@/locale";
import { redirect } from "next/navigation";

interface Props {
  params: {
    locale: Locale;
    currency: string;
  };
}

export default function CurrencyPage({ params: { locale, currency } }: Props) {
  redirect(
    `${locale !== DEFAULT_LOCALE ? `/${locale}` : ""}/currencies/${currency}/history`,
  );
}
