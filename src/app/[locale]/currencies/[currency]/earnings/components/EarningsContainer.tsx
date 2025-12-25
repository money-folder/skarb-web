import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { fetchEarnings, fetchEarningTypes } from "../actions";
import CreateEarningButton from "./create-earning/CreateEarningButton";
import EarningsEmptyState from "./EarningsEmptyState";
import EarningsFilters from "./EarningsFilters";
import EarningsTable from "./EarningsTable";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
  comment?: string;
  page?: number;
  pageSize?: number;
}

export default async function EarningsContainer({
  locale,
  currency,
  fromTs,
  toTs,
  types: selectedTypes,
  comment,
  page,
  pageSize,
}: Props) {
  const [dEarningsContainer, dModals] = await Promise.all([
    getDictionary(locale, "currencyPage.earningsContainer"),
    getDictionary(locale, "modals"),
  ]);

  const [{ data: types }, { data: earnings, total }] = await Promise.all([
    fetchEarningTypes(currency),
    fetchEarnings(currency, {
      fromTs,
      toTs,
      types: selectedTypes,
      comment,
      page,
      pageSize,
    }),
  ]);

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="flex gap-5">
        <CreateEarningButton
          text={dEarningsContainer.createButtonLabel}
          currency={currency}
          types={types}
          dictionary={{
            title: dModals.createEarning.title,
            form: dModals.earningForm,
          }}
        />
        <EarningsFilters
          types={types}
          dictionary={dEarningsContainer.earningsFilters}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {earnings?.length ? (
          <EarningsTable
            locale={locale}
            earnings={earnings}
            currency={currency}
            total={total}
            types={types}
          />
        ) : (
          <EarningsEmptyState
            locale={locale}
            currency={currency}
            fromTs={fromTs}
            toTs={toTs}
            types={selectedTypes}
            comment={comment}
          />
        )}
      </div>
    </div>
  );
}
