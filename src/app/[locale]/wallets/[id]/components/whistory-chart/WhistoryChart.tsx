"use client";

import { useState } from "react";

import { ClientChartWhistoryDto } from "@/app/[locale]/wallets/[id]/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WhistoryLineChart from "./WhistoryLineChart";

interface Props {
  data: ClientChartWhistoryDto[];
  walletId: string;
  fromTs?: number;
  toTs?: number;
  detailization: number;
  onDetailizationChange: (detailization: number) => void;
}

const DETAILIZATION_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const WhistoryChart = ({
  data,
  detailization: initialDetailization,
  onDetailizationChange,
}: Props) => {
  const [detailization, setDetailization] = useState<string>(
    String(initialDetailization),
  );

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

      <WhistoryLineChart data={data} />
    </div>
  );
};

export default WhistoryChart;
