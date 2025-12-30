"use client";

import { useContext } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { WhistoryComposed } from "@/app/[locale]/wallets/[id]/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { formatDateOnly } from "@/shared/utils/time-utils";

interface Props {
  width: number;
  height: number;
  data: WhistoryComposed[];
}

const chartConfig = {
  moneyAmount: {
    label: "Balance",
  },
  date: {
    label: "Date",
  },
} satisfies ChartConfig;

const WhistoryComposedChart = ({ data }: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <ChartContainer className="w-full" config={chartConfig}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <Line
          isAnimationActive={false}
          type="linear"
          dataKey="moneyAmount"
          stroke="hsl(var(--foreground))"
          strokeWidth={1}
        />

        <ChartTooltip
          labelFormatter={(ts) => {
            return formatDateOnly(new Date(ts));
          }}
          formatter={(value) => [value, d.charts.whistory.tooltip.balanceLabel]}
        />

        <XAxis
          padding={{ left: 20, right: 20 }}
          style={{ fontSize: "12px" }}
          dataKey="date"
          scale="linear"
          tickFormatter={(ts) => formatDateOnly(new Date(ts))}
        />
        <YAxis
          padding={{ top: 20, bottom: 20 }}
          style={{ fontSize: "12px" }}
          scale="linear"
          tickMargin={5}
          dataKey="moneyAmount"
        />
      </LineChart>
    </ChartContainer>
  );
};

export default WhistoryComposedChart;
