import { auth } from "@/auth";
import {
  CreateWhistoryRequestDto,
  WhistoryDbWithWallet,
} from "@/types/wallets-history";
import * as whistoryRepository from "@/app/[locale]/wallets/[id]/repository";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { ErrorCauses } from "@/shared/types/errors";
import { FetchWalletHistoryParams } from "@/types/wallets";

const verifyWalletOwnership = async (userId: string, whistoryId: string) => {
  const wallet = await whistoryRepository.findWallet(whistoryId);
  return !!wallet && wallet.ownerId === userId;
};

export const getWalletHistory = async (walletId: string) => {
  return await whistoryRepository.findByWallet(walletId);
};

export const getCurrentUserWalletHistory = async (
  walletId: string,
  params?: FetchWalletHistoryParams
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const walletHistory = await whistoryRepository.findUserWallet(
    session.user.id,
    walletId,
    params
  );

  if (!walletHistory) {
    throw new Error("Wallet history was not found!", {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  const whistory = walletHistory.map((wh, i, array) => ({
    ...wh,
    changes: array[i - 1]
      ? (array[i].moneyAmount - array[i - 1].moneyAmount) /
        array[i - 1].moneyAmount
      : null,
    changesAbs: array[i - 1]
      ? array[i].moneyAmount - array[i - 1].moneyAmount
      : null,
  }));

  const sums = whistory.reduce(
    (acc, item) => {
      if (item.changesAbs && item.changesAbs < 0) {
        return { ...acc, decreasesSum: acc.decreasesSum + item.changesAbs };
      } else if (item.changesAbs) {
        return { ...acc, increasesSum: acc.increasesSum + item.changesAbs };
      }

      return acc;
    },
    { increasesSum: 0, decreasesSum: 0 }
  );

  const increasesDecreasesDiff = sums.increasesSum + sums.decreasesSum;

  return { whistory, increasesDecreasesDiff, ...sums };
};

const getUserWalletsHistoryByCurrency = async (
  userId: string,
  currency: string
) => {
  const wallets = await walletsRepository.findByUserCurrency(userId, currency);

  const whPromises = wallets.map(async (w) =>
    (await whistoryRepository.findByWallet(w.id)).map((wh) => ({
      ...wh,
      wallet: w,
    }))
  );

  const whistories = await Promise.all(whPromises);

  return whistories
    .reduce((acc, item) => [...acc, ...item], [])
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());
};

export const getCurrentUserCurrencyWhistory = async (
  currency: string,
  params: FetchWalletHistoryParams
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const whistory = await getUserWalletsHistoryByCurrency(
    session.user.id,
    currency
  );

  const dataByWallets = whistory.reduce<{
    [key: string]: WhistoryDbWithWallet[];
  }>((acc, item) => {
    if (!acc[item.walletId]) {
      return { ...acc, [item.walletId]: [item] };
    }

    return { ...acc, [item.walletId]: [...acc[item.walletId], item] };
  }, {});

  const earliestEntryDate = whistory[0]?.date;
  const latestEntryDate = whistory[whistory.length - 1]?.date;
  let currentDate = new Date(earliestEntryDate);

  let touchedIntervalEnd = false;
  const dataByWalletsList = Object.values(dataByWallets);
  const mergedWhistoryGroups = [];
  while (currentDate <= latestEntryDate) {
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

    currentDate.setDate(currentDate.getDate() + 1);
    if (!touchedIntervalEnd && currentDate > latestEntryDate) {
      currentDate = new Date(latestEntryDate);
      touchedIntervalEnd = true;
    }
  }

  let composedWhistory = mergedWhistoryGroups.map((mwg, i, array) => {
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
        a.wallet.name.localeCompare(b.wallet.name)
      ),
      moneyAmount: curMoneyAmount,
      changes: prevMoneyAmount
        ? (curMoneyAmount - prevMoneyAmount) / prevMoneyAmount
        : null,
      changesAbs: prevMoneyAmount ? curMoneyAmount - prevMoneyAmount : null,
    };
  });

  // TODO: it's super cringe to do a lot of extra composing work and then just skip it if it doesn't fit the filter params 🤦‍♀️
  if (params) {
    composedWhistory = composedWhistory.filter((cw) => {
      if (params.fromTs && cw.date.valueOf() < params.fromTs) {
        return false;
      }

      if (params.toTs && cw.date.valueOf() > params.toTs) {
        return false;
      }

      return true;
    });
  }

  return composedWhistory;
};

export const createWhistory = async (dto: CreateWhistoryRequestDto) => {
  return await whistoryRepository.create({
    ...dto,
    date: new Date(dto.date),
  });
};

export const duplicateWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const target = await whistoryRepository.findById(id);
  if (!target) {
    throw new Error("Target wallet history entry was not found!", {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  const targetWallet = await walletsRepository.findById(target.walletId);
  if (targetWallet?.ownerId !== session.user.id) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.create({
    moneyAmount: target?.moneyAmount,
    walletId: target.walletId,
    date: new Date(),
  });
};

export const archiveSelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.archive(id);
};

export const unarchiveSelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToUndelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToUndelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.unarchive(id);
};

export const destroySelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.destroy(id);
};
