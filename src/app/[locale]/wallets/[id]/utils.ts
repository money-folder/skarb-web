import { WhistoryDbWithWallet } from "./types";

export type WhistoryByWallets = {
  [key: string]: WhistoryDbWithWallet[];
};

export const groupWhistoryByWallets = (whistory: WhistoryDbWithWallet[]) =>
  whistory.reduce<WhistoryByWallets>((acc, item) => {
    if (!acc[item.walletId]) {
      return { ...acc, [item.walletId]: [item] };
    }

    return { ...acc, [item.walletId]: [...acc[item.walletId], item] };
  }, {});

export type WhistoryByDate = {
  walletsMap: {
    [key: string]: WhistoryDbWithWallet;
  };
  date: Date;
}[];

export const groupWhistoryByDate = (
  start: Date,
  end: Date,
  dataByWallets: WhistoryByWallets,
): WhistoryByDate => {
  let touchedIntervalEnd = false;
  let currentDate = new Date(start);
  const dataByWalletsList = Object.values(dataByWallets);
  const mergedWhistoryGroups = [];
  while (currentDate <= end) {
    const whistoriesToMerge: { [key: string]: WhistoryDbWithWallet } = {};
    dataByWalletsList.forEach((dbw) => {
      let latestEntry = null;
      while (dbw[0] && dbw[0].date <= currentDate) {
        latestEntry = dbw.shift();
      }

      if (latestEntry) {
        whistoriesToMerge[latestEntry.walletId] = latestEntry;
      }
    });

    const lastMergedWhistoryGroup =
      mergedWhistoryGroups[mergedWhistoryGroups.length - 1];

    Object.values(lastMergedWhistoryGroup?.walletsMap || {}).forEach((lmwg) => {
      if (!whistoriesToMerge[lmwg.walletId]) {
        whistoriesToMerge[lmwg.walletId] = lmwg;
      }
    });

    mergedWhistoryGroups.push({
      walletsMap: { ...whistoriesToMerge },
      date: new Date(currentDate),
    });

    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    if (currentDate < end && nextDate >= end && !touchedIntervalEnd) {
      currentDate = new Date(end);
      touchedIntervalEnd = true;
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return mergedWhistoryGroups;
};

export const composeWhistoryMoneyAmount = (whistoryByData: WhistoryByDate) => {
  return whistoryByData.map((mwg, i, array) => {
    const list = Object.values(mwg.walletsMap);

    const calculateMoneyAmount = (walletsList: WhistoryDbWithWallet[]) =>
      +walletsList.reduce((acc, item) => acc + item.moneyAmount, 0).toFixed(2);

    const curMoneyAmount = calculateMoneyAmount(list);
    const prevMoneyAmount = array[i - 1]
      ? calculateMoneyAmount(Object.values(array[i - 1].walletsMap))
      : null;

    return {
      date: mwg.date,
      whistories: list.sort((a, b) =>
        a.wallet.name.localeCompare(b.wallet.name),
      ),
      moneyAmount: curMoneyAmount,
      changes: prevMoneyAmount
        ? (curMoneyAmount - prevMoneyAmount) / prevMoneyAmount
        : null,
      changesAbs: prevMoneyAmount ? curMoneyAmount - prevMoneyAmount : null,
    };
  });
};
