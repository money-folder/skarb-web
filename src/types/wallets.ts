export interface CreateWalletDto {
  name: string;
  ownerId: string;
  currency: string;
}

export interface ClientWalletDto {
  id: string;
  name: string;
  currency: string;
  latestBalanceTs: string;
  latestBalance: number;
  createdAt: Date;
  deletedAt: Date | null;
}
