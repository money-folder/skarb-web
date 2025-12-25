import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { fetchExpenses, fetchTypes } from "../actions";
import CreateExpenseButton from "./create-expense/CreateExpenseButton";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { ExpensesContainerDictionary } from "./dictionary";
import ExpensesCalendarContainer from "./ExpensesCalendarContainer";
import ExpensesChartContainer from "./ExpensesChartContainer";
import ExpensesEmptyState from "./ExpensesEmptyState";
import ExpensesFilters from "./ExpensesFilters";
import ExpensesTableContainer from "./ExpensesTableContainer";

interface Props {
  locale: Locale;
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
  comment?: string;
}

export default async function ExpensesContainer({
  locale,
  currency,
  fromTs,
  toTs,
  types: selectedTypes,
  comment,
}: Props) {
  const [{ data: types }, { data: expenses }] = await Promise.all([
    fetchTypes(currency),
    fetchExpenses(currency, {
      fromTs,
      toTs,
      types: selectedTypes,
      comment,
    }),
  ]);

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
        <ExpensesFilters types={types} />
      </div>

      {expenses?.length ? (
        <>
          <div className="col-span-1 row-span-1 overflow-auto">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <ExpensesTableContainer
                locale={locale}
                currency={currency}
                fromTs={fromTs}
                toTs={toTs}
                types={selectedTypes}
                expenses={expenses}
                allTypes={types}
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
              <TabsContent
                value="overview"
                className="flex flex-col gap-4 pt-4"
              >
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <ExpensesChartContainer
                    currency={currency}
                    fromTs={fromTs}
                    toTs={toTs}
                    types={selectedTypes}
                    expenses={expenses}
                  />
                </Suspense>
              </TabsContent>
              <TabsContent
                value="calendar"
                className="flex flex-grow flex-col items-center justify-center overflow-y-auto"
              >
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <ExpensesCalendarContainer
                    currency={currency}
                    fromTs={fromTs}
                    toTs={toTs}
                    types={selectedTypes}
                    expenses={expenses}
                    allTypes={types}
                  />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="col-span-2 row-span-1 overflow-auto">
          <ExpensesEmptyState
            locale={locale}
            currency={currency}
            fromTs={fromTs}
            toTs={toTs}
            types={selectedTypes}
            comment={comment}
          />
        </div>
      )}
    </div>
  );
}
