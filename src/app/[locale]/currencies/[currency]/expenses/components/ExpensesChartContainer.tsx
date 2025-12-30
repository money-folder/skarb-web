import { WithMounted } from "@/shared/components/WithMounted";
import {
  PIE_CHART_HEIGHT_DEFAULT,
  PIE_CHART_WIDTH_DEFAULT,
} from "@/shared/constants/charts";
import { fetchEarningsSum } from "../../earnings/actions";
import { fetchCurrencyIntervalTotalDiff } from "../../history/actions";
import type { Expense } from "../actions";
import ExpensesChart from "./expenses-chart/ExpensesChart";

interface Props {
  currency: string;
  fromTs?: number;
  toTs?: number;
  types?: string[];
  expenses: Expense[];
}

export default async function ExpensesChartContainer({
  currency,
  fromTs,
  toTs,
  expenses,
}: Props) {
  const [{ data: intervalDiff }, { data: earningsSum }] = await Promise.all([
    fetchCurrencyIntervalTotalDiff(currency, {
      fromTs,
      toTs,
    }),
    fetchEarningsSum(currency, {
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
        expensesSum={earningsSum - intervalDiff}
        currency={currency}
        trackedExpenses={expenses
          .reduce((sum, expense) => sum + Math.abs(expense.moneyAmount), 0)
          .toFixed(2)}
      />
    </WithMounted>
  );
}
