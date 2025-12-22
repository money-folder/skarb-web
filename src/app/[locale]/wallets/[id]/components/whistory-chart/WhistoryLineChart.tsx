"use client";

import { useContext } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ClientChartWhistoryDto } from "@/app/[locale]/wallets/[id]/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getAxisTimestamps } from "./utils";

interface Props {
  data: ClientChartWhistoryDto[];
}

const chartConfig = {
  moneyAmount: {
    label: "Balance",
  },
  dateTs: {
    label: "Date",
  },
} satisfies ChartConfig;

const WhistoryLineChart = ({ data }: Props) => {
  const { d } = useContext(DictionaryContext);

  const formattedList = data.map((i) => ({ ...i, dateTs: i.date.getTime() }));
  const timestamps = getAxisTimestamps(formattedList);

  return (
    <ChartContainer config={chartConfig}>
      <LineChart data={formattedList}>
        <CartesianGrid strokeDasharray="3 3" />
        <Line
          isAnimationActive={false}
          type="linear"
          dataKey="moneyAmount"
          stroke="hsl(var(--foreground))"
          strokeWidth={1}
        />

        <ChartTooltip
          labelFormatter={(...ts) => {
            return new Date(ts[0]).toLocaleString().split(",")[0];
          }}
          formatter={(value) => [value, d.charts.whistory.tooltip.balanceLabel]}
        />

        <XAxis
          padding={{ left: 20, right: 20 }}
          style={{ fontSize: "12px" }}
          dataKey="dateTs"
          scale="linear"
          tickFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
          ticks={timestamps}
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

export default WhistoryLineChart;
