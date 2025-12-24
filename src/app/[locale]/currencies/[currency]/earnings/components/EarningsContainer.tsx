import { Locale } from "@/locale";
import { fetchEarnings, fetchTypes } from "../actions";
import CreateEarningButton from "./create-earning/CreateEarningButton";
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
  const [{ data: types }, earningsResult] = await Promise.all([
    fetchTypes(currency),
    fetchEarnings(currency, {
      fromTs,
      toTs,
      types: selectedTypes,
      comment,
      page,
      pageSize,
    }),
  ]);

  const { data: earnings, total } = earningsResult;

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="flex gap-5">
        <CreateEarningButton text="Create" currency={currency} types={types} />
        <EarningsFilters types={types} />
      </div>
      <div className="flex-1 overflow-auto">
        {earnings?.length ? (
          <EarningsTable
            locale={locale}
            earnings={earnings}
            currency={currency}
            total={total}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No earnings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
