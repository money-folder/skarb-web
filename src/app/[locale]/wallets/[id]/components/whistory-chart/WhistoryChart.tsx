"use client";

import { useContext, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ClientChartWhistoryDto } from "@/app/[locale]/wallets/[id]/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getAxisTimestamps } from "../whistory-chart/utils";

interface Props {
  width: number;
  height: number;
  data: ClientChartWhistoryDto[];
  walletId: string;
  fromTs?: number;
  toTs?: number;
  detailization: number;
  onDetailizationChange: (detailization: number) => void;
}

const DETAILIZATION_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const WhistoryChart = ({
  width,
  height,
  data,
  detailization: initialDetailization,
  onDetailizationChange,
}: Props) => {
  const { d } = useContext(DictionaryContext);
  const [detailization, setDetailization] = useState<string>(
    String(initialDetailization),
  );

  const formattedList = data.map((i) => ({ ...i, dateTs: i.date.getTime() }));
  const timestamps = getAxisTimestamps(formattedList);

  const handleDetailizationChange = (value: string) => {
    setDetailization(value);
    onDetailizationChange(Number(value));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Select value={detailization} onValueChange={handleDetailizationChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="100%" />
          </SelectTrigger>
          <SelectContent>
            {DETAILIZATION_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
                {"%"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
};

export default WhistoryChart;
