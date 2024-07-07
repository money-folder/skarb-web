"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { ClientWhistoryDto } from "@/types/wallets-history";

interface Props {
  width: number;
  height: number;
  list: ClientWhistoryDto[];
}

const WalletHistoryChart = ({ width, height, list }: Props) => {
  const formattedList = list
    .map((i) => ({ ...i, dateTs: i.date.getTime() }))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  return (
    <LineChart width={width} height={height} data={formattedList}>
      <CartesianGrid strokeDasharray="3 3" />

      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="moneyAmount"
        stroke="black"
      />

      <Tooltip
        separator=": "
        contentStyle={{ fontSize: "12px" }}
        labelFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
        formatter={(value) => [value, "Money Amount"]}
      />

      <XAxis
        style={{ fontSize: "12px" }}
        dataKey="dateTs"
        tickFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
      />
      <YAxis style={{ fontSize: "12px" }} dataKey="moneyAmount" />
    </LineChart>
  );
};

export default WalletHistoryChart;
