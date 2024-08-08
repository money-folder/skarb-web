"use client";

import { useContext } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { WhistoryComposed } from "@/types/wallets-history";
import { DictionaryContext } from "@/components/Dictionary";

interface Props {
  width: number;
  height: number;
  list: WhistoryComposed[];
}

const WhistoryComposedChart = ({ width, height, list }: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <LineChart width={width} height={height}>
      <XAxis
        padding={{ left: 20, right: 20 }}
        dataKey="date"
        scale="linear"
        hide
        tickFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
      />

      <YAxis
        padding={{ top: 20, bottom: 20 }}
        style={{ fontSize: "8px", stroke: "black", strokeWidth: "0.5" }}
        scale="linear"
        tickMargin={5}
        dataKey="moneyAmount"
      />

      <Tooltip
        separator=": "
        contentStyle={{ fontSize: "10px", padding: "5px" }}
        labelFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
        formatter={(value) => [value, d.charts.whistory.tooltip.balanceLabel]}
      />

      <Line
        isAnimationActive={false}
        type="linear"
        dataKey="moneyAmount"
        data={list}
        dot={false}
        stroke="black"
      />
    </LineChart>
  );
};

export default WhistoryComposedChart;
