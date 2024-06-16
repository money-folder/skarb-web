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

export type ClientWHistoryDto = {
  id: string;
  walletId: string;
  moneyAmount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
