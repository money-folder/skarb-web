"use client";

import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { DictionaryContext } from "@/components/Dictionary";
import { ClientWhistoryDto } from "@/types/wallets-history";
import { getAxisTimestamps } from "./utils";

interface Props {
  width: number;
  height: number;
  list: ClientWhistoryDto[];
}

const WalletHistoryChart = ({ width, height, list }: Props) => {
  const { d } = useContext(DictionaryContext);

  const formattedList = list.map((i) => ({ ...i, dateTs: i.date.getTime() }));
  const timestamps = getAxisTimestamps(formattedList);

  return (
    <LineChart width={width} height={height} data={formattedList}>
      <CartesianGrid strokeDasharray="3 3" />
      <Line
        isAnimationActive={false}
        type="linear"
        dataKey="moneyAmount"
        stroke="black"
      />

      <Tooltip
        separator=": "
        contentStyle={{ fontSize: "12px" }}
        labelFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
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
  );
};

export default WalletHistoryChart;
