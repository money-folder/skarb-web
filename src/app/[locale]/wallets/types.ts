import { DateDifference } from "@/shared/utils/time-utils";
import { z } from "zod";
import { WhistoryDb } from "./[id]/types";
import {
  createWalletRequestSchema,
  updateWalletRequestSchema,
  walletFormSchema,
} from "./validation";

export type WalletDb = {
  id: string;
  name: string;
  ownerId: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateWalletDto = {
  name: string;
  ownerId: string;
  currency: string;
};

export type CreateWalletRequestDto = z.infer<typeof createWalletRequestSchema>;

export type UpdateWalletRequestDto = z.infer<typeof updateWalletRequestSchema>;

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

export type FetchWhistoryParams = {
  fromTs?: number;
  toTs?: number;
};

export type WalletFormValues = z.infer<typeof walletFormSchema>;
