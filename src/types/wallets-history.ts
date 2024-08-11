import { WalletDb } from "./wallets";

export type CreateWhistoryRequestDto = {
  walletId: string;
  moneyAmount: number;
  date: number;
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
};
