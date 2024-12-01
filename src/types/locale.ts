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
  whistoryPage: {
    title: string;
    filters: {
      form: {
        fromLabel: string;
        toLabel: string;
        resetLabel: string;
      };
    };
    whistoryTable: {
      balance: string;
      date: string;
      changes: string;
      actions: string;
    };
    loadingWhistoryFailed: string;
    cards: {
      walletChangesSummary: {
        title: string;
      };
      whistoryEntriesSummary: {
        title: string;
        in: string;
      };
    };
    whistoryEmpty: string;
    notEnoughDataForChart: string;
  };
  currencyPage: {
    filters: {
      form: {
        fromLabel: string;
        toLabel: string;
        resetLabel: string;
      };
    };
    currencyTable: {
      moneyAmount: string;
      changes: string;
      wallets: string;
      date: string;
    };
  };
  sidebar: {
    walletsTitle: string;
    currenciesTitle: string;
    githubSigninLabel: string;
    signoutLabel: string;
  };
  modals: {
    createWhistory: {
      title: string;
      form: {
        dateLabel: string;
        amountLabel: string;
        commentLabel: string;
        cancelLabel: string;
        submitLabel: string;
      };
    };
    createWallet: {
      title: string;
      form: {
        nameLabel: string;
        currencyLabel: string;
        cancelLabel: string;
        submitLabel: string;
      };
    };
  };
  charts: {
    whistory: {
      tooltip: {
        balanceLabel: string;
      };
    };
    whistoryChanges: {
      tooltip: {
        changesLabel: string;
      };
    };
  };
}
