"use client";

import { ClientWhistoryDto } from "@/types/wallets-history";
import { getWhistoryAbsChangesData } from "./utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  width: number;
  height: number;
  list: ClientWhistoryDto[];
}

const WhistoryChangesChart = ({ width, height, list }: Props) => {
  const result = getWhistoryAbsChangesData(list);

  return (
    <BarChart width={width} height={height} data={result}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        padding={{ left: 20, right: 20 }}
        style={{ fontSize: "12px" }}
        dataKey="midDate"
        tickFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
      />
      <YAxis
        padding={{ top: 20, bottom: 20 }}
        style={{ fontSize: "12px" }}
        tickMargin={5}
        dataKey="changes"
      />

      <Tooltip
        contentStyle={{ fontSize: "12px" }}
        labelFormatter={(ts) => new Date(ts).toLocaleString().split(",")[0]}
      />

      <Bar dataKey="changes" fill="#8884d8" isAnimationActive={false}>
        {result.map((item) => (
          <Cell
            key={`${item.startDate.getTime()}-${item.finishDate.getTime()}`}
            fill={item.changes < 0 ? "#ef4444" : "#16a34a"}
          />
        ))}
      </Bar>
    </BarChart>
  );
};

export default WhistoryChangesChart;
