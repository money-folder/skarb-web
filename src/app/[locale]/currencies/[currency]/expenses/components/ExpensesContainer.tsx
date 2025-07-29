import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { WithMounted } from "@/shared/components/WithMounted";
import {
  PIE_CHART_HEIGHT_DEFAULT,
  PIE_CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";
import { fetchExpenses } from "../actions";
import ExpensesTable from "./ExpensesTable";
import CreateExpenseButton from "./create-expense/CreateExpenseButton";
import ExpensesChart from "./expenses-chart/ExpensesChart";

interface Props {
  locale: Locale;
  currency: string;
}

export default async function ExpensesContainer({ locale, currency }: Props) {
  const { data: expenses } = await fetchExpenses(currency);
  const d = await getDictionary(locale, "currencyPage.expensesContainer");

  return expenses ? (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex gap-5">
        <CreateExpenseButton text={d.createButtonLabel} currency={currency} />
      </div>
      <div className="col-span-1 row-span-1 overflow-auto">
        {expenses.length ? (
          <ExpensesTable
            locale={locale}
            expenses={expenses}
            currency={currency}
          />
        ) : (
          <p>{d.noExpenses}</p>
        )}
      </div>
      <div className="col-span-1 row-span-1 flex flex-col items-center justify-start overflow-y-auto">
        <WithMounted>
          <ExpensesChart
            width={PIE_CHART_WIDTH_DEFAULT}
            height={PIE_CHART_HEIGHT_DEFAULT}
            expenses={expenses}
            currency={currency}
          />
        </WithMounted>
      </div>
    </div>
  ) : (
    <p>{d.loadingFailed}</p>
  );
}
