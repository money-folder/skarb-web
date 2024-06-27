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
  changes: number;
  latestBalanceTs: string | null;
  latestBalance: number | null;
  createdAt: Date;
  deletedAt: Date | null;
};
