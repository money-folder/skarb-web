import { Locale } from "@/locale";
import ExpensesContainer from "./components/ExpensesContainer";

interface Props {
  params: {
    locale: Locale;
    currency: string;
  };
}

export default async function ExpensesPage({
  params: { locale, currency },
}: Props) {
  return (
    <div className="grid h-full w-full overflow-hidden">
      <div className="flex h-full overflow-hidden pt-5">
        <ExpensesContainer locale={locale} currency={currency} />
      </div>
    </div>
  );
}
