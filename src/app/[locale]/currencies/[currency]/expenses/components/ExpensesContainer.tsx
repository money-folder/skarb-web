import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import ExpensesTable from "./ExpensesTable";
import CreateExpenseButton from "./create-expense/CreateExpenseButton";
import ExpensesCalendar from "./expenses-calendar/ExpensesCalendar";
import ExpensesChart from "./expenses-chart/ExpensesChart";

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

  const d = await getDictionary(locale, "currencyPage.expensesContainer");

  if (!expenses?.length || !types?.length || !expensesSum) {
    console.warn("Either expenses, or types, or expensesSum are empty", {
      expenses,
      types,
      expensesSum,
      fromTs,
      toTs,
    });
  }

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex gap-5">
        <CreateExpenseButton
          text={d.createButtonLabel}
          currency={currency}
          types={types}
        />
      </div>

      <div className="col-span-2 row-span-1">
        <div className="w-fit">
          <Card className="px-6 py-4">
            <CardHeader className="p-0">
              <CardTitle>{d.totalExpenses}</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 p-0">
              <p className="text-center">{Math.abs(expensesSum).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-1 row-span-1 overflow-auto">
        {expenses.length ? (
          <ExpensesTable
            locale={locale}
            expenses={expenses}
            types={types}
            currency={currency}
          />
        ) : (
          <p>{d.noExpenses}</p>
        )}
      </div>
      <div className="col-span-1 row-span-1 overflow-y-auto">
        <Tabs
          defaultValue="chart"
          className="relative flex h-full w-full flex-col"
        >
          <TabsList className="grid w-2/3 grid-cols-2">
            <TabsTrigger value="chart">{d.chartTab}</TabsTrigger>
            <TabsTrigger value="calendar">{d.calendarTab}</TabsTrigger>
          </TabsList>
          <TabsContent
            value="chart"
            className="flex flex-col items-center justify-center"
          >
            <WithMounted>
              <ExpensesChart
                width={PIE_CHART_WIDTH_DEFAULT}
                height={PIE_CHART_HEIGHT_DEFAULT}
                expenses={expenses}
                expensesSum={expensesSum || 0}
                currency={currency}
              />
            </WithMounted>
          </TabsContent>
          <TabsContent
            value="calendar"
            className="flex flex-grow flex-col items-center justify-center overflow-y-auto"
          >
            <WithMounted>
              <ExpensesCalendar expenses={expenses} />
            </WithMounted>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
