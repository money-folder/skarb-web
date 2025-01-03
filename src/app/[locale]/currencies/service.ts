import { findUserCurrencies } from "@/app/[locale]/currencies/repository";
import * as whistoryRepository from "@/app/[locale]/wallets/[id]/repository";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";
import {
  composeWhistoryMoneyAmount,
  getWhistoryWithinInterval,
  groupWhistoryByDate,
  groupWhistoryByWallets,
} from "../wallets/[id]/utils";
import { FetchWhistoryParams } from "../wallets/types";

export const getCurrentUserCurrencies = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  return findUserCurrencies(session.user.id);
};

export const getUserCurrencyWhistory = async (
  userId: string,
  currency: string,
) => {
  const wallets = await walletsRepository.findByUserCurrency(userId, currency);

  const whPromises = wallets.map(async (w) =>
    (await whistoryRepository.findByWallet(w.id)).map((wh) => ({
      ...wh,
      wallet: w,
    })),
  );

  const whistories = await Promise.all(whPromises);

  return whistories
    .reduce((acc, item) => [...acc, ...item], [])
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());
};

export const getCurrentUserCurrencyWhistory = async (
  currency: string,
  params: FetchWhistoryParams,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const whistory = await getUserCurrencyWhistory(session.user.id, currency);
  const intervalWhistory = getWhistoryWithinInterval(whistory, params);
  const dataByWallets = groupWhistoryByWallets(intervalWhistory);
  if (!Object.keys(dataByWallets).length) {
    return [];
  }

  const mergedWhistoryGroups = groupWhistoryByDate(
    intervalWhistory[0]?.date,
    intervalWhistory[intervalWhistory.length - 1]?.date,
    dataByWallets,
  );

  return composeWhistoryMoneyAmount(mergedWhistoryGroups);
};
