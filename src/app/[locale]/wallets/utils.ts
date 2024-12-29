import { ClientWalletDto } from "./types";

export const groupByCurrency = (wallets: ClientWalletDto[]) =>
  Object.entries(
    wallets.reduce<{ [key: string]: number }>((acc, item) => {
      if (!item.latestWhistory) {
        return acc;
      }

      if (acc[item.currency]) {
        acc[item.currency] += item.latestWhistory.moneyAmount;
      } else {
        acc[item.currency] = item.latestWhistory.moneyAmount;
      }

      return acc;
    }, {}),
  ).map(([currency, moneyAmount]) => ({ currency, moneyAmount }));
