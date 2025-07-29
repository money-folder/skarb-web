"use client";

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
  currency: string;
}

const ExpensesChart = ({ width, height, expenses, currency }: Props) => {
  const data: ExpensesChartEntry[] = getExpensesData(expenses);

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
        {`${payload?.[0]?.name} ${payload?.[0]?.value}`}&nbsp;{`${currency}`}
      </div>
    );
  };

  return (
    <div className="overflow-auto">
      <PieChart width={width} height={height} data={data}>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
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
  );
};

export default ExpensesChart;
