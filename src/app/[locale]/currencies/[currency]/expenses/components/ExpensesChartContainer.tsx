import { WithMounted } from "@/shared/components/WithMounted";
import {
  PIE_CHART_HEIGHT_DEFAULT,
  PIE_CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";
import { fetchCurrencyWhistoryExpenses } from "../../history/actions";
import { fetchExpenses } from "../actions";
import ExpensesChart from "./expenses-chart/ExpensesChart";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
}

export default async function ExpensesChartContainer({
  currency,
  fromTs,
  toTs,
  types,
}: Props) {
  const [{ data: expenses }, { data: expensesSum }] = await Promise.all([
    fetchExpenses(currency, {
      fromTs,
      toTs,
      types,
    }),
    fetchCurrencyWhistoryExpenses(currency, {
      fromTs,
      toTs,
    }),
  ]);

  return (
    <WithMounted>
      <ExpensesChart
        width={PIE_CHART_WIDTH_DEFAULT}
        height={PIE_CHART_HEIGHT_DEFAULT}
        expenses={expenses}
        expensesSum={expensesSum}
        currency={currency}
        totalExpenses={Math.abs(expensesSum).toFixed(2)}
        trackedExpenses={expenses
          .reduce((sum, expense) => sum + Math.abs(expense.moneyAmount), 0)
          .toFixed(2)}
      />
    </WithMounted>
  );
}
