import { WalletDb } from "../types";

export type CreateWhistoryRequestDto = {
  walletId: string;
  moneyAmount: number;
  date: number;
  comment?: string;
};

export type CreateWhistoryDto = {
  walletId: string;
  moneyAmount: number;
  date: Date;
};

export type WhistoryDb = {
  id: string;
  walletId: string;
  moneyAmount: number;
  date: Date;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type WhistoryDbWithWallet = WhistoryDb & {
  wallet: WalletDb;
};

export type ClientWhistoryDto = WhistoryDb & {
  changes: number | null;
  changesAbs: number | null;
};

export type WhistoryComposed = {
  date: Date;
  whistories: WhistoryDbWithWallet[];
  moneyAmount: number;
  changes: number | null;
  changesAbs: number | null;
};
