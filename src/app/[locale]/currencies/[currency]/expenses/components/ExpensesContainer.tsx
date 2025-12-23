import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { WithMounted } from "@/shared/components/WithMounted";
import {
  PIE_CHART_HEIGHT_DEFAULT,
  PIE_CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";
import { fetchCurrencyWhistoryExpenses } from "../../history/actions";
import { fetchExpenses, fetchTypes } from "../actions";
import CreateExpenseButton from "./create-expense/CreateExpenseButton";
import ExpensesCalendar from "./expenses-calendar/ExpensesCalendar";
import ExpensesChart from "./expenses-chart/ExpensesChart";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { ExpensesContainerDictionary } from "./dictionary";
import ExpensesFilters from "./ExpensesFilters";
import ExpensesTableContainer from "./ExpensesTableContainer";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
}

export default async function ExpensesContainer({
  locale,
  currency,
  fromTs,
  toTs,
}: Props) {
  const { data: expenses } = await fetchExpenses(currency, {
    fromTs,
    toTs,
  });
  const { data: types } = await fetchTypes(currency);
  const { data: expensesSum } = await fetchCurrencyWhistoryExpenses(currency, {
    fromTs,
    toTs,
  });

  const d = (await getDictionary(
    locale,
    "currencyPage.expensesContainer",
  )) as ExpensesContainerDictionary;

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex gap-5">
        <CreateExpenseButton
          text={d.createButtonLabel}
          currency={currency}
          types={types}
        />
        <ExpensesFilters />
      </div>

      <div className="col-span-1 row-span-1 overflow-auto">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ExpensesTableContainer
            locale={locale}
            currency={currency}
            fromTs={fromTs}
            toTs={toTs}
          />
        </Suspense>
      </div>
      <div className="col-span-1 row-span-1 overflow-y-auto">
        <Tabs
          defaultValue="overview"
          className="relative flex h-full w-full flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">{d.overviewTab}</TabsTrigger>
            <TabsTrigger value="calendar">{d.calendarTab}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="flex flex-col gap-4 pt-4">
            <div>
              <WithMounted>
                <ExpensesChart
                  width={PIE_CHART_WIDTH_DEFAULT}
                  height={PIE_CHART_HEIGHT_DEFAULT}
                  expenses={expenses}
                  expensesSum={expensesSum}
                  currency={currency}
                  totalExpenses={Math.abs(expensesSum).toFixed(2)}
                  trackedExpenses={expenses
                    .reduce(
                      (sum, expense) => sum + Math.abs(expense.moneyAmount),
                      0,
                    )
                    .toFixed(2)}
                />
              </WithMounted>
            </div>
          </TabsContent>
          <TabsContent
            value="calendar"
            className="flex flex-grow flex-col items-center justify-center overflow-y-auto"
          >
            <WithMounted>
              <ExpensesCalendar
                expenses={expenses}
                currency={currency}
                types={types}
              />
            </WithMounted>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
