"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { ClientChartWhistoryDto } from "@/app/[locale]/wallets/[id]/types";

import WhistoryChart from "./WhistoryChart";

interface Props {
  walletId: string;
  fromTs?: number;
  toTs?: number;
  detailization: number;
  initialData: ClientChartWhistoryDto[];
}

const WhistoryChartClient = ({
  walletId,
  fromTs,
  toTs,
  detailization,
  initialData,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleDetailizationChange = (detailization: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("detailization", String(detailization));

    if (fromTs) {
      params.set("from", String(fromTs));
    }

    if (toTs) {
      params.set("to", String(toTs));
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <WhistoryChart
      data={initialData}
      walletId={walletId}
      fromTs={fromTs}
      toTs={toTs}
      detailization={detailization}
      onDetailizationChange={handleDetailizationChange}
    />
  );
};

export default WhistoryChartClient;
