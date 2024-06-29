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

export type ClientWhistoryDto = {
  id: string;
  walletId: string;
  moneyAmount: number;
  changes: number | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
