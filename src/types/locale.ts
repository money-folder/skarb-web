export interface Dictionary {
  walletsPage: {
    title: string;
    walletsTable: {
      name: string;
      balance: string;
      currency: string;
      changes: string;
      sinceLastReport: string;
      actions: string;
    };
    loadingWalletsFailed: string;
  };
  walletHistoryPage: {
    title: string;
  };
}
