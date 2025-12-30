"use client";

import { useContext } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ClientWhistoryDto } from "@/app/[locale]/wallets/[id]/types";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { formatDateOnly } from "@/shared/utils/time-utils";

import { getWhistoryAbsChangesData } from "./utils";

interface Props {
  width: number;
  height: number;
  data: ClientWhistoryDto[];
}

const WhistoryChangesChart = ({ width, height, data }: Props) => {
  const { d } = useContext(DictionaryContext);

  const result = getWhistoryAbsChangesData(data);

  return (
    <BarChart width={width} height={height} data={result}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        padding={{ left: 20, right: 20 }}
        style={{ fontSize: "12px" }}
        dataKey="midDate"
        tickFormatter={(ts) => formatDateOnly(new Date(ts))}
      />
      <YAxis
        padding={{ top: 20, bottom: 20 }}
        style={{ fontSize: "12px" }}
        tickMargin={5}
        dataKey="changes"
      />

      <Tooltip
        contentStyle={{ fontSize: "12px" }}
        labelFormatter={(ts) => formatDateOnly(new Date(ts))}
        formatter={(value) => [
          value,
          d.charts.whistoryChanges.tooltip.changesLabel,
        ]}
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
