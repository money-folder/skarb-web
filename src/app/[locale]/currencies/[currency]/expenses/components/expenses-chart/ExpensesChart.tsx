"use client";

import { DictionaryContext } from "@/shared/components/Dictionary";
import { useContext } from "react";
import { Cell, Pie, PieChart, Tooltip, TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ClientExpenseDto } from "../../types";
import { ExpensesChartEntry } from "./types";
import { getExpensesData } from "./utils";

interface Props {
  width: number;
  height: number;
  expenses: ClientExpenseDto[];
  expensesSum: number;
  currency: string;
  trackedExpenses: string;
}

const ExpensesChart = ({
  width,
  height,
  expenses,
  expensesSum,
  currency,
}: Props) => {
  const { d: dictionary } = useContext(DictionaryContext);
  const data: ExpensesChartEntry[] = getExpensesData(
    expenses,
    expensesSum,
    dictionary,
  );

  const renderCustomizedLabel = ({
    percent,
  }: ExpensesChartEntry & { percent: number }) => {
    return `${((percent ?? 1) * 100).toFixed(2)}%`;
  };

  const renderTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    const isVisible = active && payload && payload.length;
    const amount = payload?.[0]?.value
      ? (+payload?.[0]?.value as number).toFixed(2)
      : "0";

    return (
      <div
        style={{
          visibility: isVisible ? "visible" : "hidden",
          backgroundColor: "rgba(0, 0, 0)",
          color: "#fff",
          maxWidth: "100px",
          wordBreak: "break-word",
          hyphens: "auto",
          padding: "4px",
        }}
      >
        {`${payload?.[0]?.name} ${amount}`}
        &nbsp;{`${currency}`}
      </div>
    );
  };

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full justify-between">
        <div className="flex w-1/2 flex-col text-sm">
          <div className="flex gap-5">
            <span className="inline-block w-[140px] font-semibold">{`${dictionary.currencyPage.expensesContainer.totalExpenses}:`}</span>
            <span>{Math.abs(expensesSum).toFixed(2)}</span>
          </div>
          <div className="flex gap-5 text-sm">
            <span className="inline-block w-[140px] font-semibold">{`${dictionary.currencyPage.expensesContainer.trackedExpenses}:`}</span>
            <span>
              {expenses
                .reduce(
                  (sum, expense) => sum + Math.abs(expense.moneyAmount),
                  0,
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex max-h-[175px] w-1/2 flex-col overflow-auto">
          {[...data].reverse().map((entry) => {
            const percentage = ((entry.value / total) * 100).toFixed(2);

            return (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="w-24 overflow-hidden text-ellipsis text-sm">
                  {entry.name}
                </span>
                <span className="text-sm tabular-nums">{`${entry.value.toFixed(2)}`}</span>
                <span className="text-sm tabular-nums">{`(${percentage}%)`}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="self-end">
        <PieChart width={width} height={height} data={data}>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={renderCustomizedLabel}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </div>
    </div>
  );
};

export default ExpensesChart;
