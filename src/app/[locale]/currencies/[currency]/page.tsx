import { DEFAULT_LOCALE, Locale } from "@/locale";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    locale: Locale;
    currency: string;
  }>;
}

export default async function CurrencyPage(props: Props) {
  const params = await props.params;

  const { locale, currency } = params;

  redirect(
    `${locale !== DEFAULT_LOCALE ? `/${locale}` : ""}/currencies/${currency}/history`,
  );
}
