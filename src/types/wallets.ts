import { DateDifference } from "@/utils/time-utils";
import { WhistoryDb } from "./wallets-history";

export type CreateWalletDto = {
  name: string;
  ownerId: string;
  currency: string;
};

export type CreateWalletRequestDto = Omit<CreateWalletDto, "ownerId">;

export type ClientWalletDto = {
  id: string;
  name: string;
  currency: string;
  changes: number | null;
  changesAbs: number | null;
  sinceLatestBallanceTs: DateDifference | null;
  latestWhistory: WhistoryDb | null;
  createdAt: Date;
  deletedAt: Date | null;
};

export type WalletsSummary = {
  currency: string;
  moneyAmount: number;
};

export type FetchWalletHistoryParams = {
  fromTs?: number;
  toTs?: number;
};
