import { ClientWalletDto } from "@/types/wallets";

export const groupByCurrency = (wallets: ClientWalletDto[]) =>
  Object.entries(
    wallets.reduce<{ [key: string]: number }>((acc, item) => {
      if (!item.latestBalance) {
        return acc;
      }

      if (acc[item.currency]) {
        acc[item.currency] += item.latestBalance;
      } else {
        acc[item.currency] = item.latestBalance;
      }

      return acc;
    }, {})
  ).map(([currency, moneyAmount]) => ({ currency, moneyAmount }));
