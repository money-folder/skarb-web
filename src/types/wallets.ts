import { DateDifference } from "@/utils/time-utils";

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
  sinceLatestBallanceTs: DateDifference | null;
  latestBalanceTs: string | null;
  latestBalance: number | null;
  createdAt: Date;
  deletedAt: Date | null;
};

export type WalletsSummary = {
  currency: string;
  moneyAmount: number;
};
