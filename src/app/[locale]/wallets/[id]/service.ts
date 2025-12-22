import * as whistoryRepository from "@/app/[locale]/wallets/[id]/repository";
import {
  CreateWhistoryRequestDto,
  UpdateWhistoryRequestDto,
} from "@/app/[locale]/wallets/[id]/types";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";

import { FetchChartWhistoryParams, FetchWhistoryParams } from "../types";

/**
 * Evenly samples an array based on detailization percentage (10-100).
 * 100% keeps all items, 50% keeps half evenly distributed, 10% keeps 10%, etc.
 * @param array - The array to sample (should be sorted by date)
 * @param detailization - Percentage of items to keep (10-100)
 * @returns Sampled array maintaining the trend
 */
const applyDetailization = <T>(
  array: T[],
  detailization: number = 100,
): T[] => {
  if (detailization >= 100 || array.length === 0) {
    return array;
  }

  const percentage = Math.max(10, Math.min(100, detailization)) / 100;
  const targetCount = Math.max(1, Math.round(array.length * percentage));

  if (targetCount >= array.length) {
    return array;
  }

  const result: T[] = [];
  const step = (array.length - 1) / (targetCount - 1);

  for (let i = 0; i < targetCount; i++) {
    const index = Math.round(i * step);
    result.push(array[index]);
  }

  return result;
};

export const verifyWhistoryOwnership = async (
  userId: string,
  whistoryId: string,
) => {
  const wallet = await whistoryRepository.findWallet(whistoryId);
  return !!wallet && wallet.ownerId === userId;
};

export const getWalletHistory = async (walletId: string) => {
  return whistoryRepository.findByWallet(walletId);
};

export const getCurrentUserWhistory = async (
  walletId: string,
  params?: FetchWhistoryParams,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const { data: walletHistory, total } =
    await whistoryRepository.findUserWallet(session.user.id, walletId, params);

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

  return { whistory, total };
};

export const getCurrentUserChartWhistory = async (
  walletId: string,
  params?: FetchChartWhistoryParams,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const { data: walletHistory } = await whistoryRepository.findUserChartWallet(
    session.user.id,
    walletId,
    params,
  );

  if (!walletHistory) {
    throw new Error("Wallet history was not found!", {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  const whistory = applyDetailization(
    walletHistory,
    params?.detailization ?? 100,
  );

  return { whistory };
};

export const createWhistory = async (dto: CreateWhistoryRequestDto) => {
  return whistoryRepository.create({
    ...dto,
    date: new Date(dto.date),
  });
};

export const updateWhistory = async (dto: UpdateWhistoryRequestDto) => {
  return whistoryRepository.update(dto);
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

  return whistoryRepository.create({
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

  const allowedToDelete = await verifyWhistoryOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.archive(id);
};

export const unarchiveSelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToUndelete = await verifyWhistoryOwnership(session.user.id, id);
  if (!allowedToUndelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.unarchive(id);
};

export const destroySelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWhistoryOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.destroy(id);
};
