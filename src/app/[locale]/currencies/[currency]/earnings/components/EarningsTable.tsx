import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { ClientEarningDto } from "../types";
import { GroupedEarningsTableClient } from "./earnings-table/GroupedEarningsTableClient";

interface Props {
  locale: Locale;
  earnings: ClientEarningDto[];
  currency: string;
  total: number;
  types?: string[];
}

export default async function EarningsTable({
  locale,
  earnings = [],
  currency,
  total,
  types,
}: Props) {
  const d = await getDictionary(locale, "currencyPage.earningsTable");

  return (
    <div className="h-full w-full">
      <GroupedEarningsTableClient
        earnings={earnings}
        currency={currency}
        total={total}
        dictionary={d}
        types={types}
      />
    </div>
  );
}
