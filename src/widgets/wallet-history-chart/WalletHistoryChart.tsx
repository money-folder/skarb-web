"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";

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
      <Line type="monotone" dataKey="moneyAmount" stroke="#8884d8" />

      <XAxis
        dataKey="dateTs"
        tickFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
      />
      <YAxis dataKey="moneyAmount" />
    </LineChart>
  );
};

export default WalletHistoryChart;
